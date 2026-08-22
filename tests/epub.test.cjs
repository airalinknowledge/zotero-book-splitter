"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const { test } = require("node:test");
const JSZip = require("jszip");
const xml = require("xml-js");

const XHTML = "http://www.w3.org/1999/xhtml";
const OPF = "http://www.idpf.org/2007/opf";
const DC = "http://purl.org/dc/elements/1.1/";
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "zbs-epub-test-"));

class TextNode {
  constructor(text) {
    this.value = text;
    this.parentNode = null;
  }
  get textContent() { return this.value; }
  set textContent(value) { this.value = String(value); }
  cloneNode() { return new TextNode(this.value); }
}

class Fragment {
  constructor(nodes = []) { this.childNodes = nodes; }
}

class Element {
  constructor(name, attributes = {}, inherited = {}) {
    this.name = name;
    this.localName = name.includes(":") ? name.split(":").at(-1) : name;
    this.attributes = { ...attributes };
    this.namespaces = { ...inherited };
    for (const [key, value] of Object.entries(attributes)) {
      if (key === "xmlns") this.namespaces[""] = value;
      else if (key.startsWith("xmlns:")) this.namespaces[key.slice(6)] = value;
    }
    const prefix = name.includes(":") ? name.split(":")[0] : "";
    this.namespaceURI = this.namespaces[prefix] ?? null;
    this.childNodes = [];
    this.parentNode = null;
  }
  get children() { return this.childNodes.filter((child) => child instanceof Element); }
  get firstChild() { return this.childNodes[0] ?? null; }
  get textContent() { return this.childNodes.map((child) => child.textContent).join(""); }
  set textContent(value) {
    this.childNodes = [];
    this.appendChild(new TextNode(String(value)));
  }
  appendChild(child) {
    if (child instanceof Fragment) {
      for (const node of child.childNodes) this.appendChild(node);
      return child;
    }
    child.parentNode?.removeChild?.(child);
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }
  removeChild(child) {
    const position = this.childNodes.indexOf(child);
    if (position >= 0) this.childNodes.splice(position, 1);
    child.parentNode = null;
    return child;
  }
  remove() { this.parentNode?.removeChild(this); }
  getAttribute(name) { return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  getAttributeNS(namespace, name) {
    for (const [key, value] of Object.entries(this.attributes)) {
      if (!key.includes(":")) continue;
      const [prefix, local] = key.split(":");
      if (local === name && this.namespaces[prefix] === namespace) return value;
    }
    return null;
  }
  getElementsByTagNameNS(namespace, name) {
    const output = [];
    for (const child of this.children) {
      if ((namespace === "*" || child.namespaceURI === namespace)
          && (name === "*" || child.localName === name)) output.push(child);
      output.push(...child.getElementsByTagNameNS(namespace, name));
    }
    return output;
  }
  getElementsByTagName(name) { return this.getElementsByTagNameNS("*", name); }
  cloneNode(deep = false) {
    const clone = new Element(this.name, this.attributes, this.namespaces);
    clone.namespaceURI = this.namespaceURI;
    if (deep) for (const child of this.childNodes) clone.appendChild(child.cloneNode(true));
    return clone;
  }
}

function rootBodyChild(node, body) {
  let current = node;
  while (current?.parentNode && current.parentNode !== body) current = current.parentNode;
  return current;
}

class Document {
  constructor(root) { this.documentElement = root; }
  getElementsByTagName(name) {
    return (name === "*" || this.documentElement.localName === name)
      ? [this.documentElement, ...this.documentElement.getElementsByTagName(name)]
      : this.documentElement.getElementsByTagName(name);
  }
  createElementNS(namespace, name) {
    const element = new Element(name, {}, this.documentElement.namespaces);
    element.namespaceURI = namespace;
    return element;
  }
  cloneNode(deep) { return new Document(this.documentElement.cloneNode(deep)); }
  createRange() {
    let body;
    let start = 0;
    let end = Infinity;
    return {
      selectNodeContents(value) { body = value; end = body.childNodes.length; },
      setStartBefore(value) { start = body.childNodes.indexOf(rootBodyChild(value, body)); },
      setEndBefore(value) { end = body.childNodes.indexOf(rootBodyChild(value, body)); },
      cloneContents() {
        if (start < 0 || end < start) throw new Error("Invalid fixture range");
        return new Fragment(body.childNodes.slice(start, end).map((node) => node.cloneNode(true)));
      },
      detach() {}
    };
  }
}

function fromAST(node, namespaces = {}) {
  if (node.type === "text" || node.type === "cdata") return new TextNode(node.text ?? node.cdata ?? "");
  if (node.type !== "element") return null;
  const element = new Element(node.name, node.attributes, namespaces);
  for (const child of node.elements ?? []) {
    const converted = fromAST(child, element.namespaces);
    if (converted) element.appendChild(converted);
  }
  return element;
}

function parseDocument(contents) {
  const parsed = xml.xml2js(contents, { compact: false, ignoreDeclaration: true });
  return new Document(fromAST(parsed.elements.find((node) => node.type === "element")));
}

function toAST(node) {
  if (node instanceof TextNode) return { type: "text", text: node.value };
  return {
    type: "element",
    name: node.name,
    attributes: node.attributes,
    elements: node.childNodes.map(toAST)
  };
}

class Serializer {
  serializeToString(document) {
    return xml.js2xml({ elements: [toAST(document.documentElement)] }, { compact: false });
  }
}

const unzipScript = [
  "import base64,json,sys,zipfile",
  "with zipfile.ZipFile(sys.argv[1]) as archive:",
  " print(json.dumps({name:base64.b64encode(archive.read(name)).decode('ascii') for name in archive.namelist()}))"
].join("\n");

const zipScript = [
  "import json,sys,zipfile",
  "entries=json.loads(sys.argv[2])",
  "with zipfile.ZipFile(sys.argv[1],'w') as archive:",
  " for name,source,compression in entries:",
  "  archive.write(source,name,compress_type=zipfile.ZIP_STORED if compression==0 else zipfile.ZIP_DEFLATED)"
].join("\n");

class FakeEPUB {
  constructor(file) {
    this.file = file;
    const entries = JSON.parse(execFileSync("python3", ["-c", unzipScript, file], { encoding: "utf8" }));
    this.entries = new Map(Object.entries(entries).map(([name, value]) => [name, Buffer.from(value, "base64")]));
    this._zipReader = {
      hasEntry: (name) => this.entries.has(name),
      extract: (name, target) => {
        if (!this.entries.has(name)) throw new Error(`Missing archive entry ${name}`);
        fs.writeFileSync(target, this.entries.get(name));
      }
    };
  }
  async _parseEntryToDocument(entry) {
    const bytes = this.entries.get(entry);
    if (!bytes) throw new Error(`Missing XML ${entry}`);
    return parseDocument(bytes.toString("utf8"));
  }
  async _getContentOPF() {
    const container = await this._parseEntryToDocument("META-INF/container.xml");
    const rootfile = container.getElementsByTagName("rootfile")[0];
    this._contentOPFPath = rootfile.getAttribute("full-path");
    return this._parseEntryToDocument(this._contentOPFPath);
  }
  async *getSectionDocuments() {
    const packageDocument = await this._getContentOPF();
    const manifest = packageDocument.getElementsByTagName("manifest")[0];
    const spine = packageDocument.getElementsByTagName("spine")[0];
    const byID = new Map(manifest.children.map((item) => [item.getAttribute("id"), item]));
    for (const reference of spine.children) {
      const item = byID.get(reference.getAttribute("idref"));
      if (!item || item.getAttribute("media-type") !== "application/xhtml+xml") continue;
      const href = new URL(item.getAttribute("href"), `zip:/${this._contentOPFPath}`).pathname.slice(1);
      yield { href, doc: await this._parseEntryToDocument(href) };
    }
  }
  close() {}
}

class FakeZipWriter {
  open(file) { this.file = file; this.entries = []; }
  addEntryFile(name, compression, file) { this.entries.push([name, file, compression]); }
  close() { execFileSync("python3", ["-c", zipScript, this.file, JSON.stringify(this.entries)]); }
}

function loadModule() {
  const context = vm.createContext({
    URL,
    console,
    ChromeUtils: { importESModule: () => ({ EPUB: FakeEPUB }) },
    XMLSerializer: Serializer,
    Cc: {
      "@mozilla.org/zipwriter;1": { createInstance: () => new FakeZipWriter() }
    },
    Ci: { nsIZipWriter: { COMPRESSION_DEFAULT: 6 } },
    Zotero: { File: { pathToFile: (value) => value } },
    PathUtils: { join: path.join, parent: path.dirname },
    IOUtils: {
      makeDirectory: async (target, options = {}) => {
        await fs.promises.mkdir(target, { recursive: Boolean(options.createAncestors || options.ignoreExisting) });
      },
      writeUTF8: async (target, value) => fs.promises.writeFile(target, value),
      remove: async (target, options = {}) => fs.promises.rm(target, {
        recursive: Boolean(options.recursive),
        force: Boolean(options.ignoreAbsent)
      })
    }
  });
  const source = fs.readFileSync(path.join(__dirname, "../src/content/epub.js"), "utf8");
  vm.runInContext(source, context, { filename: "epub.js" });
  return context.ZoteroBookSplitterEPUB;
}

async function writeFixture(filename, sharedDocument = false) {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip.file("META-INF/container.xml", `<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf"/></rootfiles></container>`);
  const chapterItems = sharedDocument
    ? `<item id="body" href="body.xhtml" media-type="application/xhtml+xml"/>`
    : `<item id="first" href="chapter-1.xhtml" media-type="application/xhtml+xml"/><item id="second" href="chapter-2.xhtml" media-type="application/xhtml+xml"/>`;
  const chapterSpine = sharedDocument
    ? `<itemref idref="body"/>`
    : `<itemref idref="first"/><itemref idref="second"/>`;
  zip.file("OEBPS/content.opf", `<package xmlns="${OPF}" xmlns:dc="${DC}" version="3.0"><metadata><dc:title>Original Collection</dc:title><dc:identifier>book-id</dc:identifier></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>${chapterItems}<item id="notes" href="notes.xhtml" media-type="application/xhtml+xml"/><item id="style" href="style.css" media-type="text/css"/><item id="image" href="image.svg" media-type="image/svg+xml"/></manifest><spine>${chapterSpine}<itemref idref="notes"/></spine><guide><reference type="toc" href="nav.xhtml"/></guide></package>`);
  const chapterOne = sharedDocument ? "body.xhtml#one" : "chapter-1.xhtml#one";
  const chapterTwo = sharedDocument ? "body.xhtml#two" : "chapter-2.xhtml#two";
  zip.file("OEBPS/nav.xhtml", `<html xmlns="${XHTML}" xmlns:epub="http://www.idpf.org/2007/ops"><body><nav epub:type="toc"><ol><li><a href="${chapterOne}">Chapter 1. First Essay</a></li><li><a href="${chapterTwo}">Chapter 2. Second Essay</a></li><li><a href="notes.xhtml">Notes</a></li></ol></nav><nav epub:type="page-list"><ol><li><a href="${chapterOne}">5</a></li><li><a href="${chapterTwo}">17</a></li><li><a href="notes.xhtml">99</a></li></ol></nav></body></html>`);
  if (sharedDocument) {
    zip.file("OEBPS/body.xhtml", `<html xmlns="${XHTML}"><head><link rel="stylesheet" href="style.css"/></head><body><h1 id="one">First Essay</h1><p>first-only <a href="notes.xhtml#note1">note</a></p><h1 id="two">Second Essay</h1><p>second-only <a href="#one">previous</a></p></body></html>`);
  } else {
    zip.file("OEBPS/chapter-1.xhtml", `<html xmlns="${XHTML}"><head><link rel="stylesheet" href="style.css"/></head><body><h1 id="one">First Essay</h1><p>first-only <a href="notes.xhtml#note1">note</a></p></body></html>`);
    zip.file("OEBPS/chapter-2.xhtml", `<html xmlns="${XHTML}"><body><h1 id="two">Second Essay</h1><p>second-only</p></body></html>`);
  }
  zip.file("OEBPS/notes.xhtml", `<html xmlns="${XHTML}"><body><p id="note1">linked-note</p><a href="missing.xhtml">missing</a></body></html>`);
  zip.file("OEBPS/style.css", "body { color: #222; background: url(image.svg); }");
  zip.file("OEBPS/image.svg", `<svg xmlns="http://www.w3.org/2000/svg"/>`);
  await fs.promises.writeFile(filename, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

test("EPUB path helpers normalize references without permitting traversal", () => {
  const helpers = loadModule()._testing;
  assert.equal(helpers.normalizePath("OEBPS/./text/chapter.xhtml"), "OEBPS/text/chapter.xhtml");
  assert.throws(() => helpers.normalizePath("../../secrets"), /Unsafe/);
  assert.throws(() => helpers.normalizePath("/etc/passwd"), /Unsafe/);
  const target = helpers.resolveReference("OEBPS/nav.xhtml", "chapter%201.xhtml#section%202");
  assert.equal(target.path, "OEBPS/chapter 1.xhtml");
  assert.equal(target.fragment, "section 2");
  assert.equal(helpers.relativeReference("OEBPS/nav/nav.xhtml", "OEBPS/text/first.xhtml", "one"), "../text/first.xhtml#one");
  assert.equal(helpers.resolveReference("OEBPS/body.xhtml", "https://example.com"), null);
});

test("EPUB chapter planning keeps notes as boundaries and supports shared XHTML anchors", () => {
  const helpers = loadModule()._testing;
  const entries = [
    { title: "Chapter 1. Alpha", path: "body.xhtml", fragment: "one", spineIndex: 0, depth: 0 },
    { title: "Chapter 2. Beta", path: "body.xhtml", fragment: "two", spineIndex: 0, depth: 0 },
    { title: "Notes", path: "notes.xhtml", fragment: "", spineIndex: 1, depth: 0 }
  ];
  const plan = helpers.buildChapterEntries(entries, 2, [{ spineIndex: 0, label: "5" }]);
  assert.equal(plan.sections.length, 2);
  assert.equal(plan.sections[0].endFragment, "two");
  assert.equal(plan.sections[1].spineEndIndex, 0);
  assert.equal(plan.sections[0].pageLabelsAreDocumentPages, false);
  assert.equal(plan.sections[0].startPageIndex, 0);
  assert.equal(plan.sections[1].startPageIndex, 1);
});

test("EPUB 3 splitting preserves styles, media and linked notes while excluding other chapters", async () => {
  const module = loadModule();
  const source = path.join(scratch, "separate.epub");
  const output = path.join(scratch, "separate-output");
  await writeFixture(source);
  await fs.promises.mkdir(output);
  const preview = await module.inspect(source);
  assert.equal(preview.proposedSections.length, 2);
  assert.equal(preview.proposedSections[0].startPageLabel, "5");
  assert.equal(preview.proposedSections[1].startPageLabel, "17");
  const results = await module.prepare(source, preview, output, [0], [{
    sourceIndex: 0,
    title: "First Essay",
    authors: ["Ada Lovelace"],
    startPageLabel: "5",
    endPageLabel: "5"
  }]);
  assert.equal(results.length, 1);
  assert.equal(results[0].contentType, "application/epub+zip");
  assert.equal(results[0].report.auxiliaryDocuments, 1);
  assert.equal(results[0].hasPageNumbers, true);
  const archive = new FakeEPUB(results[0].path);
  assert.equal(archive.entries.get("mimetype").toString(), "application/epub+zip");
  assert(archive.entries.has("OEBPS/chapter-1.xhtml"));
  assert(archive.entries.has("OEBPS/notes.xhtml"));
  assert(archive.entries.has("OEBPS/style.css"));
  assert(archive.entries.has("OEBPS/image.svg"));
  assert(!archive.entries.has("OEBPS/chapter-2.xhtml"));
  assert.match(archive.entries.get("OEBPS/content.opf").toString(), /First Essay/);
  assert.match(archive.entries.get("OEBPS/content.opf").toString(), /linear="no"/);
  assert(!archive.entries.get("OEBPS/nav.xhtml").toString().includes("Second Essay"));
  const compression = execFileSync("python3", ["-c", "import sys,zipfile; a=zipfile.ZipFile(sys.argv[1]); print(a.infolist()[0].filename,a.infolist()[0].compress_type)", results[0].path], { encoding: "utf8" }).trim();
  assert.equal(compression, "mimetype 0");
});

test("EPUB splitting trims multiple chapter anchors from a shared XHTML document", async () => {
  const module = loadModule();
  const source = path.join(scratch, "shared.epub");
  const output = path.join(scratch, "shared-output");
  await writeFixture(source, true);
  await fs.promises.mkdir(output);
  const preview = await module.inspect(source);
  assert.equal(preview.proposedSections.length, 2);
  const edits = preview.proposedSections.map((section, sourceIndex) => ({
    sourceIndex,
    title: sourceIndex ? "Second Essay" : "First Essay",
    authors: [],
    startPageLabel: String(sourceIndex + 1),
    endPageLabel: String(sourceIndex + 1)
  }));
  const result = await module.prepare(source, preview, output, [0, 1], edits);
  const first = new FakeEPUB(result[0].path).entries.get("OEBPS/body.xhtml").toString();
  const second = new FakeEPUB(result[1].path).entries.get("OEBPS/body.xhtml").toString();
  assert.match(first, /first-only/);
  assert(!first.includes("second-only"));
  assert.match(second, /second-only/);
  assert(!second.includes("first-only"));
  assert(!second.includes('href="#one"'));
  assert.equal(result[0].hasPageNumbers, false);
});

test("EPUB 2 NCX navigation remains readable after selecting an individual chapter", async () => {
  const module = loadModule();
  const source = path.join(scratch, "legacy.epub");
  const output = path.join(scratch, "legacy-output");
  await writeFixture(source);
  const archive = await JSZip.loadAsync(await fs.promises.readFile(source));
  archive.remove("OEBPS/nav.xhtml");
  let packageXML = await archive.file("OEBPS/content.opf").async("string");
  packageXML = packageXML
    .replace('version="3.0"', 'version="2.0"')
    .replace('<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>', '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>')
    .replace('<spine>', '<spine toc="ncx">')
    .replace('<guide><reference type="toc" href="nav.xhtml"/></guide>', '');
  archive.file("OEBPS/content.opf", packageXML);
  archive.file("OEBPS/toc.ncx", '<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/"><docTitle><text>Original Collection</text></docTitle><navMap><navPoint id="one" playOrder="1"><navLabel><text>Chapter 1. First Essay</text></navLabel><content src="chapter-1.xhtml#one"/></navPoint><navPoint id="two" playOrder="2"><navLabel><text>Chapter 2. Second Essay</text></navLabel><content src="chapter-2.xhtml#two"/></navPoint><navPoint id="notes" playOrder="3"><navLabel><text>Notes</text></navLabel><content src="notes.xhtml"/></navPoint></navMap></ncx>');
  await fs.promises.writeFile(source, await archive.generateAsync({ type: "nodebuffer" }));
  await fs.promises.mkdir(output);
  const preview = await module.inspect(source);
  assert.equal(preview.navigationPath, null);
  assert.equal(preview.ncxPath, "OEBPS/toc.ncx");
  assert.equal(preview.proposedSections.length, 2);
  const result = await module.prepare(source, preview, output, [1], [{
    sourceIndex: 1,
    title: "Second Essay",
    authors: [],
    startPageLabel: "2",
    endPageLabel: "2"
  }]);
  const split = new FakeEPUB(result[0].path);
  assert(split.entries.has("OEBPS/chapter-2.xhtml"));
  assert(!split.entries.has("OEBPS/chapter-1.xhtml"));
  assert(!split.entries.has("OEBPS/notes.xhtml"));
  assert.match(split.entries.get("OEBPS/toc.ncx").toString(), /Second Essay/);
  assert(!split.entries.get("OEBPS/toc.ncx").toString().includes("First Essay"));
});

test("EPUB rights files are rejected before any chapter is generated", async () => {
  const module = loadModule();
  const source = path.join(scratch, "protected.epub");
  await writeFixture(source);
  const archive = await JSZip.loadAsync(await fs.promises.readFile(source));
  archive.file("META-INF/rights.xml", "<rights/>");
  await fs.promises.writeFile(source, await archive.generateAsync({ type: "nodebuffer" }));
  await assert.rejects(() => module.inspect(source), /DRM-protected/);
});
