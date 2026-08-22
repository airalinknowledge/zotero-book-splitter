"use strict";

/**
 * Merge confirmed chapters into the complete, original PDF bookmark tree.
 * Chapter extraction intentionally suppresses descendants and front/back
 * matter; those filters must never decide which existing bookmarks survive.
 */
var ZoteroBookSplitterOutlinePreservation = (() => {
  function normalizedTitle(value) {
    return String(value ?? "").normalize("NFKC").replace(/\s+/gu, " ").trim().toLocaleLowerCase("en-US");
  }

  function existingBookmark(entry) {
    return {
      structuralTitle: entry.title,
      depth: entry.depth,
      startPageIndex: entry.pageIndex,
      sourceOutlineId: entry.id,
      preserveOriginalDestination: true,
      ...(Object.hasOwn(entry, "authors") ? { authors: [...entry.authors] } : {}),
      ...(Object.hasOwn(entry, "citationTitle") ? { citationTitle: entry.citationTitle } : {})
    };
  }

  function matchExisting(existing, planned, used) {
    const byID = existing.findIndex((entry) => entry.id === planned.sourceId);
    if (byID >= 0 && !used.has(byID)) return byID;

    const candidates = existing.map((entry, index) => ({ entry, index })).filter(
      ({ entry, index }) => !used.has(index)
        && entry.pageIndex === planned.startPageIndex
        && (entry.emit || normalizedTitle(entry.title) === normalizedTitle(planned.structuralTitle))
    );
    candidates.sort((left, right) => {
      const leftDepth = Number(left.entry.depth === planned.depth);
      const rightDepth = Number(right.entry.depth === planned.depth);
      if (leftDepth !== rightDepth) return rightDepth - leftDepth;
      const leftTitle = Number(normalizedTitle(left.entry.title) === normalizedTitle(planned.structuralTitle));
      const rightTitle = Number(normalizedTitle(right.entry.title) === normalizedTitle(planned.structuralTitle));
      if (leftTitle !== rightTitle) return rightTitle - leftTitle;
      return left.index - right.index;
    });
    return candidates[0]?.index ?? -1;
  }

  function insertMissing(result, planned) {
    let insertion = result.length;
    for (let index = 0; index < result.length; index += 1) {
      const existing = result[index];
      if (existing.depth !== 0 || !Number.isInteger(existing.startPageIndex)) continue;
      if (existing.startPageIndex > planned.startPageIndex) {
        insertion = index;
        break;
      }
    }
    result.splice(insertion, 0, { ...planned });
  }

  function merge(existingEntries, plannedEntries) {
    if (!Array.isArray(existingEntries) || !existingEntries.length) {
      return plannedEntries.map((entry) => ({ ...entry }));
    }

    const result = existingEntries.map(existingBookmark);
    const used = new Set();
    const missing = [];
    for (const planned of plannedEntries) {
      const index = matchExisting(existingEntries, planned, used);
      if (index < 0) {
        missing.push(planned);
        continue;
      }
      used.add(index);
      const original = existingEntries[index];
      result[index] = {
        ...planned,
        depth: original.depth,
        sourceOutlineId: original.id,
        preserveOriginalDestination: original.pageIndex === planned.startPageIndex
      };
    }

    for (const planned of missing) insertMissing(result, planned);
    return result;
  }

  return { merge };
})();
