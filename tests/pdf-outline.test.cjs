"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const pdf = require("pdf-lib");

const source = fs.readFileSync(path.join(__dirname, "../src/content/plugin.js"), "utf8");
const start = source.indexOf("  // src/pdf/writeOutline.ts\n");
const end = source.indexOf("  // src/zotero/bytes.ts\n", start);
assert(start >= 0 && end > start, "The PDF outline writer must remain available in the generated bundle");

const runtime = vm.createContext({
  init_safeConsole() {},
  PDFDocument_default: pdf.PDFDocument,
  PDFName_default: pdf.PDFName,
  PDFDict_default: pdf.PDFDict,
  PDFRef_default: pdf.PDFRef,
  PDFHexString_default: pdf.PDFHexString,
  PDFArray_default: pdf.PDFArray,
  PDFNumber_default: pdf.PDFNumber,
  A2: pdf.PDFName.of("A")
});
vm.runInContext(`${source.slice(start, end)}\nglobalThis.writeNativeOutline = writeNativeOutline;`, runtime);

const preservationContext = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "../src/content/outline-preservation.js"), "utf8"),
  preservationContext
);
const { merge } = preservationContext.ZoteroBookSplitterOutlinePreservation;

async function createFixture() {
  const document = await pdf.PDFDocument.create();
  for (let index = 0; index < 12; index += 1) document.addPage();
  const name = pdf.PDFName.of;
  const root = pdf.PDFDict.withContext(document.context);
  const rootRef = document.context.register(root);
  root.set(name("Type"), name("Outlines"));
  root.set(name("ZBSRootMarker"), pdf.PDFString.of("preserved-root"));
  document.catalog.set(name("Outlines"), rootRef);

  function node(title, page, options = {}) {
    const dictionary = pdf.PDFDict.withContext(document.context);
    const ref = document.context.register(dictionary);
    dictionary.set(name("Title"), pdf.PDFHexString.fromText(title));
    if (page !== null) {
      const destination = pdf.PDFArray.withContext(document.context);
      destination.push(document.getPage(page).ref);
      destination.push(name(options.destination ?? "Fit"));
      if (options.destination === "XYZ") {
        destination.push(pdf.PDFNumber.of(10));
        destination.push(pdf.PDFNumber.of(20));
        destination.push(pdf.PDFNumber.of(1));
      }
      dictionary.set(name("Dest"), destination);
    }
    if (options.action) {
      const action = pdf.PDFDict.withContext(document.context);
      action.set(name("S"), name("URI"));
      action.set(name("URI"), pdf.PDFString.of(options.action));
      dictionary.set(name("A"), action);
    }
    if (options.style) dictionary.set(name("F"), pdf.PDFNumber.of(options.style));
    return { dictionary, ref, page, title, id: `outline-${ref.objectNumber}` };
  }

  const cover = node("Cover", 0);
  const part = node("Part I", null, { action: "https://example.test/part" });
  const chapterOne = node("Chapter 1. Old", 2, { destination: "XYZ", style: 2 });
  const subsection = node("1.1 Original section", 4, { style: 1 });
  const chapterTwo = node("Chapter 2. Original", 7);
  const references = node("References", 11);

  function chain(nodes, parent) {
    parent.dictionary.set(name("First"), nodes[0].ref);
    parent.dictionary.set(name("Last"), nodes.at(-1).ref);
    for (let index = 0; index < nodes.length; index += 1) {
      nodes[index].dictionary.set(name("Parent"), parent.ref);
      if (index) nodes[index].dictionary.set(name("Prev"), nodes[index - 1].ref);
      if (index + 1 < nodes.length) nodes[index].dictionary.set(name("Next"), nodes[index + 1].ref);
    }
  }

  chain([cover, part, chapterTwo, references], { dictionary: root, ref: rootRef });
  chain([chapterOne], part);
  chain([subsection], chapterOne);
  part.dictionary.set(name("Count"), pdf.PDFNumber.of(-2));
  chapterOne.dictionary.set(name("Count"), pdf.PDFNumber.of(1));
  root.set(name("Count"), pdf.PDFNumber.of(6));

  const entries = [
    { ...cover, depth: 0, emit: false },
    { ...part, depth: 0, emit: false },
    { ...chapterOne, depth: 1, emit: true },
    { ...subsection, depth: 2, emit: false },
    { ...chapterTwo, depth: 0, emit: true },
    { ...references, depth: 0, emit: false }
  ].map(({ id, title, page, depth, emit }) => ({ id, title, depth, pageIndex: page, emit }));

  return { bytes: await document.save(), entries, chapterOne, chapterTwo };
}

function readOutline(document) {
  const name = pdf.PDFName.of;
  const root = document.catalog.lookup(name("Outlines"), pdf.PDFDict);
  const entries = [];
  const visit = (first, depth) => {
    for (let current = first; current;) {
      const item = document.context.lookup(current, pdf.PDFDict);
      const destination = item.lookupMaybe(name("Dest"), pdf.PDFArray);
      entries.push({
        title: item.lookup(name("Title")).decodeText(),
        depth,
        destination: destination?.get(1)?.decodeText?.(),
        destinationLength: destination?.size(),
        style: item.lookupMaybe(name("F"), pdf.PDFNumber)?.asNumber(),
        count: item.lookupMaybe(name("Count"), pdf.PDFNumber)?.asNumber(),
        action: item.lookupMaybe(name("A"), pdf.PDFDict)?.lookup(name("URI"))?.decodeText(),
        authors: item.lookupMaybe(name("ZBSAuthors"), pdf.PDFHexString)?.decodeText(),
        citationTitle: item.lookupMaybe(name("ZBSCitationTitle"), pdf.PDFHexString)?.decodeText()
      });
      const child = item.get(name("First"));
      if (child) visit(child, depth + 1);
      current = item.get(name("Next"));
    }
  };
  visit(root.get(name("First")), 0);
  return { root, entries };
}

test("real PDF rewrite preserves nested trees, external actions, exact destinations, styles, and collapse state", async () => {
  const fixture = await createFixture();
  const planned = [
    {
      sourceId: fixture.chapterOne.id,
      structuralTitle: "Chapter 1. Corrected",
      citationTitle: "Corrected",
      authors: ["Ada Lovelace"],
      depth: 0,
      startPageIndex: 2
    },
    {
      sourceId: fixture.chapterTwo.id,
      structuralTitle: "Chapter 2. Corrected",
      citationTitle: "Corrected Two",
      authors: [],
      depth: 0,
      startPageIndex: 7
    }
  ];

  const merged = merge(fixture.entries, planned);
  const bytes = await runtime.writeNativeOutline(fixture.bytes, merged);
  const reopened = await pdf.PDFDocument.load(bytes);
  const { root, entries } = readOutline(reopened);

  assert.deepEqual(entries.map((entry) => entry.title), [
    "Cover", "Part I", "Chapter 1. Corrected", "1.1 Original section", "Chapter 2. Corrected", "References"
  ]);
  assert.deepEqual(entries.map((entry) => entry.depth), [0, 0, 1, 2, 0, 0]);
  assert.equal(entries[1].action, "https://example.test/part");
  assert.equal(entries[1].count, -2);
  assert.equal(entries[2].destination, "XYZ");
  assert.equal(entries[2].destinationLength, 5);
  assert.equal(entries[2].style, 2);
  assert.equal(entries[2].authors, "Ada Lovelace");
  assert.equal(entries[2].citationTitle, "Corrected");
  assert.equal(entries[3].style, 1);
  assert.equal(root.lookup(pdf.PDFName.of("ZBSRootMarker")).decodeText(), "preserved-root");
});

test("bookmark writer can still construct a new PDF outline from scratch", async () => {
  const document = await pdf.PDFDocument.create();
  document.addPage();
  document.addPage();
  const bytes = await runtime.writeNativeOutline(await document.save(), [
    { structuralTitle: "First", depth: 0, startPageIndex: 0 },
    { structuralTitle: "Second", depth: 0, startPageIndex: 1 }
  ]);
  const entries = readOutline(await pdf.PDFDocument.load(bytes)).entries;
  assert.deepEqual(entries.map((entry) => entry.title), ["First", "Second"]);
});
