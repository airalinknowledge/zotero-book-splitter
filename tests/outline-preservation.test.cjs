"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const context = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(__dirname, "../src/content/outline-preservation.js"), "utf8"),
  context,
  { filename: "outline-preservation.js" }
);
const { merge } = context.ZoteroBookSplitterOutlinePreservation;

function chapter(sourceId, title, page, extras = {}) {
  return {
    sourceId,
    structuralTitle: title,
    citationTitle: title.replace(/^Chapter \d+\.\s*/u, ""),
    authors: ["New Author"],
    depth: 0,
    startPageIndex: page,
    ...extras
  };
}

test("bookmark repair preserves filtered entries, nested descendants, and grouping nodes", () => {
  const original = [
    { id: "cover", title: "Cover", depth: 0, pageIndex: 0, emit: false },
    { id: "part", title: "Part I", depth: 0, pageIndex: null, emit: false },
    { id: "one", title: "Chapter 1. Old Title", depth: 1, pageIndex: 3, emit: true },
    { id: "section", title: "1.1 Existing Section", depth: 2, pageIndex: 5, emit: false },
    { id: "subsection", title: "1.1.1 Existing Subsection", depth: 3, pageIndex: 6, emit: false },
    { id: "two", title: "Chapter 2. Another Essay", depth: 1, pageIndex: 10, emit: true },
    { id: "references", title: "References", depth: 0, pageIndex: 30, emit: false }
  ];
  const updated = merge(original, [
    chapter("one", "Chapter 1. Corrected Title", 3),
    chapter("two", "Chapter 2. Another Essay", 10)
  ]);

  assert.equal(updated.length, original.length);
  assert.deepEqual(Array.from(updated, (entry) => entry.sourceOutlineId), original.map((entry) => entry.id));
  assert.deepEqual(Array.from(updated, (entry) => entry.depth), [0, 0, 1, 2, 3, 1, 0]);
  assert.equal(updated[1].startPageIndex, null);
  assert.equal(updated[2].structuralTitle, "Chapter 1. Corrected Title");
  assert.equal(updated[2].citationTitle, "Corrected Title");
  assert.equal(updated[2].authors[0], "New Author");
  assert.equal(updated[3].structuralTitle, "1.1 Existing Section");
  assert.equal(updated[6].structuralTitle, "References");
});

test("printed and AI chapter plans update existing page matches without replacing cover bookmarks", () => {
  const original = [
    { id: "cover", title: "Cover", depth: 0, pageIndex: 0, emit: false },
    { id: "old", title: "Scanned chapter", depth: 0, pageIndex: 0, emit: true },
    { id: "nested", title: "Nested section", depth: 1, pageIndex: 2, emit: false },
    { id: "last", title: "Last chapter", depth: 0, pageIndex: 8, emit: true }
  ];
  const updated = merge(original, [
    chapter("printed-0", "Chapter 1. Recovered", 0),
    chapter("printed-1", "Chapter 2. Recovered", 8)
  ]);

  assert.equal(updated[0].structuralTitle, "Cover");
  assert.equal(updated[1].structuralTitle, "Chapter 1. Recovered");
  assert.equal(updated[2].structuralTitle, "Nested section");
  assert.equal(updated[3].structuralTitle, "Chapter 2. Recovered");
});

test("new chapter bookmarks are inserted between complete existing subtrees", () => {
  const original = [
    { id: "one", title: "First", depth: 0, pageIndex: 2, emit: true },
    { id: "child", title: "First section", depth: 1, pageIndex: 4, emit: false },
    { id: "index", title: "Index", depth: 0, pageIndex: 20, emit: false }
  ];
  const updated = merge(original, [
    chapter("one", "Chapter 1. First", 2),
    chapter("printed-new", "Chapter 2. Added", 10)
  ]);

  assert.deepEqual(Array.from(updated, (entry) => entry.structuralTitle), [
    "Chapter 1. First", "First section", "Chapter 2. Added", "Index"
  ]);
  assert.equal(updated[2].sourceOutlineId, undefined);
});

test("files without an existing outline receive the confirmed chapter plan", () => {
  const planned = [chapter("one", "Chapter 1. First", 0), chapter("two", "Chapter 2. Second", 5)];
  const updated = merge([], planned);
  assert.equal(updated.length, 2);
  assert.equal(updated[0].structuralTitle, "Chapter 1. First");
  assert.notEqual(updated[0], planned[0]);
});
