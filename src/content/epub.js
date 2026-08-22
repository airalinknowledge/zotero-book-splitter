"use strict";

/**
 * EPUB support deliberately lives outside the generated PDF bundle. Zotero
 * already ships an EPUB reader and Gecko ZIP services, so splitting does not
 * require another bundled archive or XML implementation.
 */
var ZoteroBookSplitterEPUB = (() => {
  const XHTML_TYPE = "application/xhtml+xml";
  const EPUB_TYPE = "application/epub+zip";
  const EPUB_NS = "http://www.idpf.org/2007/ops";
  const DC_NS = "http://purl.org/dc/elements/1.1/";
  const NCX_TYPE = "application/x-dtbncx+xml";
  const IGNORED_TITLES = /^(?:cover|title\s*page|contents?|table of contents|copyright|index|acknowledg(?:e)?ments?|notes?|endnotes?|bibliograph(?:y|ies)|references?|目录|封面|版权页|索引|致谢|注释|尾注|参考文献)$/iu;
  const STRUCTURAL_TITLES = /^(?:(?:part|section|book|volume)\s+(?:\d+|[ivxlcdm]+)\b|第\s*[一二三四五六七八九十百\d]+\s*[部分卷篇])/iu;

  function normalizePath(value) {
    const input = String(value ?? "").replace(/\\/gu, "/");
    if (!input || input.startsWith("/") || input.includes("\0")) {
      throw new Error(`Unsafe EPUB archive path: ${input}`);
    }
    const output = [];
    for (const component of input.split("/")) {
      if (!component || component === ".") continue;
      if (component === "..") {
        if (!output.length) throw new Error(`Unsafe EPUB archive path: ${input}`);
        output.pop();
      } else {
        output.push(component);
      }
    }
    if (!output.length) throw new Error(`Invalid EPUB archive path: ${input}`);
    return output.join("/");
  }

  function decodePart(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function resolveReference(basePath, reference) {
    const raw = String(reference ?? "").trim();
    if (!raw || /^(?:[a-z][a-z\d+.-]*:|\/\/)/iu.test(raw)) return null;
    const hashPosition = raw.indexOf("#");
    const pathPart = hashPosition < 0 ? raw : raw.slice(0, hashPosition);
    const fragment = hashPosition < 0 ? "" : decodePart(raw.slice(hashPosition + 1));
    const pathname = pathPart.split("?")[0] ?? "";
    if (!pathname) return { path: normalizePath(basePath), fragment };
    const resolved = new URL(pathname, `zip:/${normalizePath(basePath)}`).pathname;
    return {
      path: normalizePath(decodePart(resolved.replace(/^\//u, ""))),
      fragment
    };
  }

  function relativeReference(fromPath, targetPath, fragment = "") {
    const from = normalizePath(fromPath).split("/");
    from.pop();
    const target = normalizePath(targetPath).split("/");
    while (from.length && target.length && from[0] === target[0]) {
      from.shift();
      target.shift();
    }
    const path = [...from.map(() => ".."), ...target].join("/") || ".";
    return `${path}${fragment ? `#${encodeURIComponent(fragment)}` : ""}`;
  }

  function descendants(element, name) {
    return Array.from(element?.getElementsByTagNameNS?.("*", name) ?? []);
  }

  function directChildren(element, name) {
    return Array.from(element?.children ?? []).filter(
      (child) => child.localName?.toLowerCase() === name.toLowerCase()
    );
  }

  function firstChild(element, name) {
    return directChildren(element, name)[0] ?? null;
  }

  function hasToken(value, token) {
    return String(value ?? "").split(/\s+/u).includes(token);
  }

  function navKind(node) {
    return node.getAttributeNS?.(EPUB_NS, "type")
      ?? node.getAttribute?.("epub:type")
      ?? node.getAttribute?.("type")
      ?? "";
  }

  function findNavigation(document, kind) {
    return descendants(document.documentElement, "nav").find(
      (node) => hasToken(navKind(node), kind)
        || (kind === "toc" && hasToken(node.getAttribute("role"), "doc-toc"))
    ) ?? null;
  }

  function findAnchor(document, fragment) {
    if (!fragment) return null;
    return Array.from(document.getElementsByTagName("*")).find(
      (node) => node.getAttribute("id") === fragment
        || node.getAttribute("name") === fragment
        || node.getAttributeNS?.("http://www.w3.org/XML/1998/namespace", "id") === fragment
    ) ?? null;
  }

  function extractNavigationEntries(navigation, navPath, spinePositions) {
    const entries = [];

    function visitList(list, depth) {
      for (const item of directChildren(list, "li")) {
        const link = firstChild(item, "a");
        const label = (link?.textContent ?? firstChild(item, "span")?.textContent ?? "")
          .replace(/\s+/gu, " ")
          .trim();
        const destination = link ? resolveReference(navPath, link.getAttribute("href")) : null;
        const spineIndex = destination ? spinePositions.get(destination.path) : undefined;
        if (label && destination && spineIndex !== undefined) {
          entries.push({
            title: label,
            path: destination.path,
            fragment: destination.fragment,
            spineIndex,
            depth
          });
        }
        for (const childList of directChildren(item, "ol")) visitList(childList, depth + 1);
      }
    }

    for (const list of directChildren(navigation, "ol")) visitList(list, 0);
    return entries;
  }

  function extractNcxEntries(document, ncxPath, spinePositions) {
    const entries = [];

    function visit(point, depth) {
      const label = firstChild(firstChild(point, "navLabel"), "text")?.textContent
        ?.replace(/\s+/gu, " ")
        .trim();
      const source = firstChild(point, "content")?.getAttribute("src");
      const destination = source ? resolveReference(ncxPath, source) : null;
      const spineIndex = destination ? spinePositions.get(destination.path) : undefined;
      if (label && destination && spineIndex !== undefined) {
        entries.push({
          title: label,
          path: destination.path,
          fragment: destination.fragment,
          spineIndex,
          depth
        });
      }
      for (const child of directChildren(point, "navPoint")) visit(child, depth + 1);
    }

    const navMap = descendants(document.documentElement, "navMap")[0];
    for (const point of directChildren(navMap, "navPoint")) visit(point, 0);
    return entries;
  }

  function extractPageEntries(navigationDocument, navigationPath, spinePositions) {
    const navigation = navigationDocument && findNavigation(navigationDocument, "page-list");
    if (!navigation) return [];
    return descendants(navigation, "a").flatMap((anchor) => {
      const destination = resolveReference(navigationPath, anchor.getAttribute("href"));
      const spineIndex = destination ? spinePositions.get(destination.path) : undefined;
      const label = anchor.textContent.replace(/\s+/gu, " ").trim();
      return destination && spineIndex !== undefined && label
        ? [{ ...destination, spineIndex, label }]
        : [];
    });
  }

  function buildChapterEntries(entries, spineLength, pageEntries) {
    const warnings = [];
    const usable = [];
    const seen = new Set();
    let previousSpine = -1;

    for (const entry of entries) {
      if (IGNORED_TITLES.test(entry.title) || STRUCTURAL_TITLES.test(entry.title)) continue;
      const key = `${entry.path}\0${entry.fragment}`;
      if (seen.has(key)) continue;
      if (entry.spineIndex < previousSpine) {
        warnings.push(`Skipped out-of-order navigation entry: ${entry.title}`);
        continue;
      }
      seen.add(key);
      previousSpine = entry.spineIndex;
      usable.push(entry);
    }

    const sections = usable.map((entry, index) => {
      const sourcePosition = entries.indexOf(entry);
      const next = entries.slice(sourcePosition + 1).find(
        (candidate) => candidate.spineIndex > entry.spineIndex
          || (candidate.path === entry.path && candidate.fragment && candidate.fragment !== entry.fragment)
      ) ?? null;
      const sameDocumentBoundary = next?.path === entry.path;
      const endSpineIndex = sameDocumentBoundary
        ? entry.spineIndex
        : next
          ? Math.max(entry.spineIndex, next.spineIndex - 1)
          : spineLength - 1;
      // A page-list maps documents reliably, but two chapter anchors inside
      // the same XHTML file need DOM-order evidence before page labels can be
      // attributed safely. Leave citation pages empty in that ambiguous case.
      const sharedDocument = usable.some((candidate, candidateIndex) =>
        candidateIndex !== index && candidate.path === entry.path
      );
      const chapterPages = sharedDocument ? [] : pageEntries.filter(
        (page) => page.spineIndex >= entry.spineIndex && page.spineIndex <= endSpineIndex
      );
      const pageLabelsAreDocumentPages = chapterPages.length > 0;
      const startPageLabel = chapterPages[0]?.label ?? String(index + 1);
      const endPageLabel = chapterPages.at(-1)?.label ?? String(index + 1);
      return {
        sourceId: `epub-${index}-${entry.spineIndex}`,
        title: entry.title,
        depth: 0,
        originalDepth: entry.depth,
        // The existing preview validates non-overlapping integer intervals.
        // Navigation order, unlike spine position, stays unique when several
        // chapter anchors live inside the same XHTML document.
        startPageIndex: index,
        endPageIndex: index,
        pageCount: endSpineIndex - entry.spineIndex + 1,
        spineStartIndex: entry.spineIndex,
        spineEndIndex: endSpineIndex,
        startPath: entry.path,
        startFragment: entry.fragment,
        endFragment: sameDocumentBoundary ? next.fragment : "",
        startPageLabel,
        endPageLabel,
        pageLabelsAreDocumentPages,
        confidence: "high",
        metadataWarnings: pageLabelsAreDocumentPages
          ? []
          : ["This EPUB has no reliable printed-page mapping; chapter positions are not written as citation pages."]
      };
    });

    return { sections, warnings };
  }

  async function inspect(path) {
    const { EPUB } = ChromeUtils.importESModule("chrome://zotero/content/EPUB.mjs");
    const epub = new EPUB(path);
    try {
      const packageDocument = await epub._getContentOPF();
      const packagePath = normalizePath(epub._contentOPFPath);
      const manifestElement = firstChild(packageDocument.documentElement, "manifest");
      const spineElement = firstChild(packageDocument.documentElement, "spine");
      if (!manifestElement || !spineElement) {
        throw new Error("The EPUB package does not contain a valid manifest and spine.");
      }

      if (epub._zipReader.hasEntry("META-INF/rights.xml")) {
        throw new Error("DRM-protected EPUB files cannot be split.");
      }

      const manifest = directChildren(manifestElement, "item").flatMap((node) => {
        const id = node.getAttribute("id");
        const href = node.getAttribute("href");
        const destination = href ? resolveReference(packagePath, href) : null;
        return id && destination
          ? [{
            id,
            href,
            path: destination.path,
            mediaType: node.getAttribute("media-type") ?? "",
            properties: node.getAttribute("properties") ?? ""
          }]
          : [];
      });
      const manifestByID = new Map(manifest.map((item) => [item.id, item]));
      const spine = directChildren(spineElement, "itemref").flatMap((node) => {
        const item = manifestByID.get(node.getAttribute("idref"));
        return item?.mediaType === XHTML_TYPE && epub._zipReader.hasEntry(item.path)
          ? [item]
          : [];
      });
      if (!spine.length) throw new Error("This EPUB does not contain readable XHTML spine documents.");
      const spinePositions = new Map(spine.map((item, index) => [item.path, index]));

      const navigationItem = manifest.find((item) => hasToken(item.properties, "nav"));
      const ncxItem = manifestByID.get(spineElement.getAttribute("toc"))
        ?? manifest.find((item) => item.mediaType === NCX_TYPE);
      let navigationDocument = null;
      let entries = [];

      if (navigationItem && epub._zipReader.hasEntry(navigationItem.path)) {
        navigationDocument = await epub._parseEntryToDocument(navigationItem.path, XHTML_TYPE);
        const navigation = findNavigation(navigationDocument, "toc");
        if (navigation) entries = extractNavigationEntries(navigation, navigationItem.path, spinePositions);
      }
      if (!entries.length && ncxItem && epub._zipReader.hasEntry(ncxItem.path)) {
        const document = await epub._parseEntryToDocument(ncxItem.path, "text/xml");
        entries = extractNcxEntries(document, ncxItem.path, spinePositions);
      }
      if (!entries.length) {
        for (const [index, item] of spine.entries()) {
          const document = await epub._parseEntryToDocument(item.path, XHTML_TYPE);
          const heading = descendants(document.documentElement, "h1")[0]
            ?? descendants(document.documentElement, "h2")[0]
            ?? descendants(document.documentElement, "title")[0];
          const title = heading?.textContent.replace(/\s+/gu, " ").trim()
            ?? decodePart(item.path.split("/").at(-1) ?? `Chapter ${index + 1}`);
          entries.push({ title, path: item.path, fragment: "", spineIndex: index, depth: 0 });
        }
      }

      const pages = extractPageEntries(navigationDocument, navigationItem?.path, spinePositions);
      const planned = buildChapterEntries(entries, spine.length, pages);
      if (!planned.sections.length) throw new Error("No usable EPUB chapter boundaries were found.");

      return {
        packagePath,
        manifest,
        spine,
        navigationPath: navigationItem?.path ?? null,
        ncxPath: ncxItem?.path ?? null,
        sourceType: "epub-navigation",
        totalPages: spine.length,
        pageLabels: spine.map((_, index) => String(index + 1)),
        proposedSections: planned.sections,
        notesRange: null,
        outlineEntries: [],
        warnings: planned.warnings
      };
    } finally {
      epub.close();
    }
  }

  function chapterDocument(sourceDocument, section, archivePath) {
    const document = sourceDocument.cloneNode(true);
    if (archivePath !== section.startPath) return document;
    const body = descendants(document.documentElement, "body")[0];
    if (!body || (!section.startFragment && !section.endFragment)) return document;

    const start = section.startFragment ? findAnchor(document, section.startFragment) : null;
    const end = section.endFragment ? findAnchor(document, section.endFragment) : null;
    if (section.startFragment && !start) {
      throw new Error(`The EPUB chapter anchor #${section.startFragment} is missing.`);
    }
    if (section.endFragment && !end) {
      throw new Error(`The EPUB chapter boundary #${section.endFragment} is missing.`);
    }

    const range = document.createRange();
    range.selectNodeContents(body);
    if (start && start !== body) range.setStartBefore(start);
    if (end && end !== body) range.setEndBefore(end);
    const fragment = range.cloneContents();
    while (body.firstChild) body.removeChild(body.firstChild);
    body.appendChild(fragment);
    range.detach?.();
    return document;
  }

  function pageLinkDestinations(document, archivePath) {
    return descendants(document.documentElement, "a").flatMap((anchor) => {
      const href = anchor.getAttribute("href");
      const destination = href ? resolveReference(archivePath, href) : null;
      return destination ? [destination] : [];
    });
  }

  function removeUnavailableLinks(document, archivePath, availablePaths, availableDocuments) {
    for (const anchor of descendants(document.documentElement, "a")) {
      const href = anchor.getAttribute("href");
      if (!href) continue;
      const destination = resolveReference(archivePath, href);
      if (!destination) continue;
      if (!availablePaths.has(destination.path)) {
        anchor.removeAttribute("href");
        continue;
      }
      const target = availableDocuments.get(destination.path);
      if (destination.fragment && target && !findAnchor(target, destination.fragment)) {
        anchor.removeAttribute("href");
      }
    }
  }

  function rewriteNavigation(document, navigationPath, section) {
    const navigation = findNavigation(document, "toc");
    if (!navigation) return document;
    let list = firstChild(navigation, "ol");
    if (!list) {
      list = document.createElementNS(navigation.namespaceURI, "ol");
      navigation.appendChild(list);
    }
    while (list.firstChild) list.removeChild(list.firstChild);
    const item = document.createElementNS(list.namespaceURI, "li");
    const link = document.createElementNS(list.namespaceURI, "a");
    link.setAttribute("href", relativeReference(navigationPath, section.startPath, section.startFragment));
    link.textContent = section.citationTitle;
    item.appendChild(link);
    list.appendChild(item);
    return document;
  }

  function rewriteNCX(document, ncxPath, section) {
    const navMap = descendants(document.documentElement, "navMap")[0];
    if (!navMap) return document;
    while (navMap.firstChild) navMap.removeChild(navMap.firstChild);
    const namespace = navMap.namespaceURI;
    const point = document.createElementNS(namespace, "navPoint");
    point.setAttribute("id", "zbs-chapter");
    point.setAttribute("playOrder", "1");
    const navLabel = document.createElementNS(namespace, "navLabel");
    const text = document.createElementNS(namespace, "text");
    text.textContent = section.citationTitle;
    navLabel.appendChild(text);
    point.appendChild(navLabel);
    const content = document.createElementNS(namespace, "content");
    content.setAttribute("src", relativeReference(ncxPath, section.startPath, section.startFragment));
    point.appendChild(content);
    navMap.appendChild(point);
    const documentTitle = descendants(document.documentElement, "docTitle")[0];
    const title = firstChild(documentTitle, "text");
    if (title) title.textContent = section.citationTitle;
    return document;
  }

  function rewritePackage(packageDocument, packagePath, info, chapterPaths, auxiliaryPaths, section) {
    const document = packageDocument.cloneNode(true);
    const root = document.documentElement;
    const manifest = firstChild(root, "manifest");
    const spine = firstChild(root, "spine");
    const keep = new Set([...chapterPaths, ...auxiliaryPaths, info.navigationPath, info.ncxPath]);
    for (const item of info.manifest) {
      if (item.mediaType !== XHTML_TYPE && item.mediaType !== "text/html") keep.add(item.path);
    }

    const keptIDs = new Set();
    for (const node of directChildren(manifest, "item")) {
      const reference = resolveReference(packagePath, node.getAttribute("href"));
      if (!reference || !keep.has(reference.path)) {
        node.remove();
      } else {
        keptIDs.add(node.getAttribute("id"));
      }
    }

    const primaryIDs = new Set(info.spine.filter((item) => chapterPaths.has(item.path)).map((item) => item.id));
    const existingIDs = new Set();
    for (const node of directChildren(spine, "itemref")) {
      const id = node.getAttribute("idref");
      if (!keptIDs.has(id) || !primaryIDs.has(id)) {
        node.remove();
      } else {
        existingIDs.add(id);
      }
    }
    for (const item of info.spine) {
      if (!auxiliaryPaths.has(item.path) || !keptIDs.has(item.id) || existingIDs.has(item.id)) continue;
      const node = document.createElementNS(spine.namespaceURI, "itemref");
      node.setAttribute("idref", item.id);
      node.setAttribute("linear", "no");
      spine.appendChild(node);
    }

    const metadata = firstChild(root, "metadata");
    const title = metadata && Array.from(metadata.children).find(
      (node) => node.localName === "title" && node.namespaceURI === DC_NS
    );
    if (title) title.textContent = section.citationTitle;
    const guide = firstChild(root, "guide");
    if (guide) {
      for (const reference of directChildren(guide, "reference")) {
        const target = resolveReference(packagePath, reference.getAttribute("href"));
        if (target && !keep.has(target.path)) reference.remove();
      }
      if (!guide.children.length) guide.remove();
    }
    return { document, keptPaths: keep };
  }

  async function ensureParent(path) {
    await IOUtils.makeDirectory(PathUtils.parent(path), { createAncestors: true, ignoreExisting: true });
  }

  async function extractArchiveEntry(reader, archivePath, targetPath) {
    await ensureParent(targetPath);
    reader.extract(archivePath, Zotero.File.pathToFile(targetPath));
  }

  async function writeXML(document, path) {
    await ensureParent(path);
    await IOUtils.writeUTF8(path, new XMLSerializer().serializeToString(document));
  }

  function archiveOutputPath(directory, archivePath) {
    return PathUtils.join(directory, ...normalizePath(archivePath).split("/"));
  }

  function createArchive(outputPath, filesDirectory, archivePaths) {
    const writer = Cc["@mozilla.org/zipwriter;1"].createInstance(Ci.nsIZipWriter);
    writer.open(Zotero.File.pathToFile(outputPath), 0x04 | 0x08 | 0x20);
    try {
      // EPUB requires the mimetype as its first uncompressed ZIP entry.
      writer.addEntryFile("mimetype", 0, Zotero.File.pathToFile(archiveOutputPath(filesDirectory, "mimetype")), false);
      for (const archivePath of [...archivePaths].filter((name) => name !== "mimetype").sort()) {
        writer.addEntryFile(
          archivePath,
          Ci.nsIZipWriter.COMPRESSION_DEFAULT,
          Zotero.File.pathToFile(archiveOutputPath(filesDirectory, archivePath)),
          false
        );
      }
    } finally {
      writer.close();
    }
  }

  async function prepareChapter(reader, info, directory, section, metadata, sourceIndex) {
    const filesDirectory = PathUtils.join(directory, `chapter-${String(sourceIndex + 1).padStart(3, "0")}`);
    await IOUtils.makeDirectory(filesDirectory, { ignoreExisting: true });
    const chapterPaths = new Set(
      info.spine.slice(section.spineStartIndex, section.spineEndIndex + 1).map((item) => item.path)
    );
    const readableDocuments = new Set(
      info.manifest.filter((item) => item.mediaType === XHTML_TYPE && reader._zipReader.hasEntry(item.path))
        .map((item) => item.path)
    );
    const documents = new Map();
    for (const archivePath of chapterPaths) {
      const document = await reader._parseEntryToDocument(archivePath, XHTML_TYPE);
      documents.set(archivePath, chapterDocument(document, section, archivePath));
    }

    // Retain one-hop notes and other internal targets without bringing every
    // chapter in through a global table of contents.
    const auxiliaryPaths = new Set();
    for (const [archivePath, document] of documents) {
      for (const target of pageLinkDestinations(document, archivePath)) {
        if (readableDocuments.has(target.path) && !chapterPaths.has(target.path)) {
          auxiliaryPaths.add(target.path);
        }
      }
    }
    for (const archivePath of auxiliaryPaths) {
      documents.set(archivePath, await reader._parseEntryToDocument(archivePath, XHTML_TYPE));
    }

    const confirmed = { ...section, citationTitle: metadata.title };
    const originalPackage = await reader._getContentOPF();
    const rewritten = rewritePackage(
      originalPackage,
      info.packagePath,
      info,
      chapterPaths,
      auxiliaryPaths,
      confirmed
    );
    const archivePaths = new Set(["mimetype", "META-INF/container.xml", info.packagePath]);
    for (const path of rewritten.keptPaths) {
      if (path && reader._zipReader.hasEntry(path)) archivePaths.add(path);
    }
    for (const metaPath of ["META-INF/encryption.xml", "META-INF/metadata.xml"]) {
      if (reader._zipReader.hasEntry(metaPath)) archivePaths.add(metaPath);
    }

    for (const path of archivePaths) {
      if (["mimetype", info.packagePath, info.navigationPath, info.ncxPath].includes(path)
          || documents.has(path)) continue;
      await extractArchiveEntry(reader._zipReader, path, archiveOutputPath(filesDirectory, path));
    }

    const mimePath = archiveOutputPath(filesDirectory, "mimetype");
    await ensureParent(mimePath);
    await IOUtils.writeUTF8(mimePath, EPUB_TYPE);
    await writeXML(rewritten.document, archiveOutputPath(filesDirectory, info.packagePath));

    for (const [path, document] of documents) {
      removeUnavailableLinks(document, path, archivePaths, documents);
      await writeXML(document, archiveOutputPath(filesDirectory, path));
    }

    if (info.navigationPath && archivePaths.has(info.navigationPath)) {
      const document = await reader._parseEntryToDocument(info.navigationPath, XHTML_TYPE);
      const navigation = rewriteNavigation(document, info.navigationPath, confirmed);
      removeUnavailableLinks(navigation, info.navigationPath, archivePaths, documents);
      await writeXML(navigation, archiveOutputPath(filesDirectory, info.navigationPath));
    }
    if (info.ncxPath && archivePaths.has(info.ncxPath)) {
      const document = await reader._parseEntryToDocument(info.ncxPath, "text/xml");
      await writeXML(rewriteNCX(document, info.ncxPath, confirmed), archiveOutputPath(filesDirectory, info.ncxPath));
    }

    const outputPath = PathUtils.join(directory, `${String(sourceIndex + 1).padStart(2, "0")}.epub`);
    createArchive(outputPath, filesDirectory, archivePaths);

    // Re-open through Zotero's own parser so a broken package never reaches the
    // Zotero library.
    const { EPUB } = ChromeUtils.importESModule("chrome://zotero/content/EPUB.mjs");
    const validation = new EPUB(outputPath);
    try {
      await validation._getContentOPF();
      let count = 0;
      for await (const entry of validation.getSectionDocuments()) count += Number(Boolean(entry.doc));
      if (!count) throw new Error(`The generated EPUB for ${metadata.title} has an empty spine.`);
    } finally {
      validation.close();
    }

    await IOUtils.remove(filesDirectory, { recursive: true, ignoreAbsent: true });
    return {
      section,
      sourceIndex,
      citationTitle: metadata.title,
      metadata: { ...metadata, authors: [...metadata.authors] },
      path: outputPath,
      contentType: EPUB_TYPE,
      hasPageNumbers: section.pageLabelsAreDocumentPages,
      report: {
        appendedPages: [],
        outputSourcePages: [],
        strippedLinks: 0,
        auxiliaryDocuments: auxiliaryPaths.size
      }
    };
  }

  async function prepare(path, info, directory, selectedIndexes, metadataEdits) {
    const { EPUB } = ChromeUtils.importESModule("chrome://zotero/content/EPUB.mjs");
    const epub = new EPUB(path);
    const metadata = new Map(metadataEdits.map((entry) => [entry.sourceIndex, entry]));
    try {
      const chapters = [];
      for (const index of selectedIndexes) {
        const section = info.proposedSections[index];
        const confirmed = metadata.get(index);
        if (!section || !confirmed) throw new Error(`Missing EPUB chapter ${index + 1}.`);
        chapters.push(await prepareChapter(epub, info, directory, section, confirmed, index));
      }
      return chapters;
    } finally {
      epub.close();
    }
  }

  return {
    contentType: EPUB_TYPE,
    inspect,
    prepare,
    // Deterministic helpers are exported for regression tests; none touches a
    // Zotero library or archive.
    _testing: {
      normalizePath,
      resolveReference,
      relativeReference,
      buildChapterEntries
    }
  };
})();
