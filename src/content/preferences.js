"use strict";
var ZoteroBookSplitterPreferences = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/zotero/preferences.ts
  var preferences_exports = {};
  __export(preferences_exports, {
    PREFS: () => PREFS,
    catalogLookupEnabled: () => catalogLookupEnabled,
    initPreferencePane: () => initPreferencePane,
    loadAiPreferences: () => loadAiPreferences,
    saveAiPreferences: () => saveAiPreferences
  });

  // src/core/uiStrings.ts
  var strings = {
    "en-US": {
      windowTitle: "Book Split Preview",
      previewTitle: "Book Split Preview",
      loading: "Loading preview\u2026",
      previewFailed: "Preview failed: {message}",
      outputTopology: "Output",
      parentAttachments: "Place PDFs under the original Book",
      independentSections: "Create independent Book Sections",
      inheritCollections: "Add to the Book's collections ({count})",
      pdf: "PDF",
      totalPages: "Total pages",
      chapterCount: "Chapters",
      source: "Source",
      selected: "Selected",
      notesRange: "Notes range",
      operation: "Operation",
      chooseChapters: "Select chapters",
      selectAll: "Select all",
      selectFinest: "Select finest level",
      selectNone: "Select none",
      select: "Select",
      position: "Position",
      bibliographicTitle: "Bibliographic title",
      chapterAuthors: "Chapter authors (semicolon-separated)",
      printedPages: "Printed pages",
      physicalPages: "PDF pages (read-only)",
      needsReview: "Needs review",
      notWritten: "No changes have been written to Zotero.",
      close: "Close",
      processSelected: "Process selected chapters\u2026",
      repairBookmarks: "Repair PDF bookmarks\u2026",
      repairingBookmarks: "Validating and replacing native PDF bookmarks\u2026",
      repairBookmarksFailed: "Bookmark repair failed: {message}",
      repairBookmarksDone: "Native bookmarks repaired. Backup: {path}",
      sourceOutline: "Native PDF bookmarks",
      sourcePrinted: "Printed table of contents (PDF.js)",
      sourceAi: "AI-assisted table of contents",
      sourceCatalog: "Catalog chapter metadata (ISBN)",
      sourceChoiceTitle: "Choose chapter source",
      sourceChoiceMessage: "This PDF contains native bookmarks. Choose which source should define the chapter boundaries.",
      sourceChoiceNoOutlineMessage: "This PDF has no usable native bookmarks. Choose local printed-contents analysis, optional AI assistance, or an edition-matched catalog TOC when an ISBN is available.",
      aiConfigTitle: "AI-assisted contents analysis",
      aiProvider: "Provider",
      aiEndpoint: "Endpoint",
      aiModel: "Model",
      aiApiKey: "API key",
      aiPageRange: "PDF evidence pages",
      aiPageRangeNote: "Editable; for example 7-18, 350-352 (maximum 40 pages)",
      aiRememberKey: "Remember this API key in Zotero preferences",
      aiPrivacyHeading: "Data that will leave this computer",
      aiWholePdfDisclosure: "The complete PDF \u201C{filename}\u201D ({pages} pages, {size} MB) will be sent to the selected provider as a native PDF document. Zotero metadata and annotations are excluded.",
      aiSamplePdfDisclosure: "A transient PDF containing source physical pages {pages} from \u201C{filename}\u201D will be sent. The complete source PDF, Zotero metadata, and annotations are excluded.",
      aiDirectModeDisclosure: "No local contents scan runs before transmission. Fast mode requires a complete contents and a confirmed pagination anchor inside the supplied sample.",
      aiWholePdfConsent: "I authorize sending the PDF data described above to the selected provider for this analysis.",
      aiSendWholePdf: "Send and analyze",
      aiInputMode: "AI input",
      aiInputFast: "Fast \u2014 first 30 PDF pages (default)",
      aiInputFull: "Complete PDF",
      aiInputManual: "Manual source pages",
      aiNativePdfUnsupported: "This provider does not define native PDF document input. Choose Gemini, OpenAI Responses, or a compatible endpoint that accepts file content parts.",
      aiCancel: "Cancel",
      aiContinue: "Analyze these pages",
      aiKeyOptional: "Optional for local OpenAI-compatible endpoints; not required for Ollama",
      aiConfigInvalid: "Check the provider settings and privacy confirmation.",
      aiProgressHeadline: "AI contents recognition",
      aiUploadingDocument: "Uploading the authorized PDF document: {completed}/{total} MB",
      aiEncodingDocument: "Preparing the authorized PDF document for transmission\u2026",
      aiWaitingForDocument: "PDF document sent to {provider}; waiting for the returned contents\u2026",
      aiCleaningRemoteFile: "AI returned; deleting the provider's temporary PDF copy\u2026",
      aiValidating: "AI response received; validating chapter boundaries locally\u2026",
      aiDone: "AI contents recognition completed; opening the preview\u2026",
      aiFailedProgress: "AI contents recognition stopped: {message}",
      aiUnavailable: "AI-assisted contents analysis failed: {message}",
      catalogUnavailable: "Catalog chapter lookup failed: {message}",
      printedNeedsOcr: "The printed table of contents cannot be analyzed because this PDF has no readable text layer. Run OCR first, then try again.",
      printedUnavailable: "The printed table of contents could not be converted into reliable chapter boundaries: {message}",
      choosePdfTitle: "Choose PDF",
      choosePdfMessage: "This Book has multiple local PDFs. Choose the file to analyze.",
      recoveryTitle: "Previous recovery journal",
      recoveryMessage: "A recovery journal from an interrupted operation exists at:\n{paths}\n\nStop unless you have verified the Zotero items. You may discard the journal and continue after that manual check.",
      recoveryStop: "Stop and keep the journal",
      recoveryDiscard: "Discard the journal and continue",
      splitBookMenu: "Split Book into Chapters\u2026",
      splitPdfMenu: "Split This PDF into Chapters\u2026",
      originalBookPdfs: "PDFs under the original Book",
      independentBookSections: "Independent Book Sections",
      atLeastOne: "Select at least one chapter",
      rangeConflict: "The selected chapter ranges overlap, share a starting page, or run backward. Deselect the conflicting entry before writing.",
      moveExisting: "Move selected chapters under the Book\u2026",
      normalizeExisting: "Update selected Book Sections\u2026",
      createParentCount: "Create {count} Book attachments\u2026",
      createSectionCount: "Create {count} Book Sections\u2026",
      controllerUnavailable: "The write controller is unavailable. Close and reopen the preview.",
      processing: "Processing selected chapters\u2026",
      processingStatus: "Processing chapters. Zotero writes occur only after confirmation and are rolled back on failure.",
      completed: "Completed",
      createFailed: "Creation failed: {message}",
      sourceTitle: "Outline text: {title}",
      confidenceHigh: "Verified",
      confidenceMedium: "Quick review",
      confidenceLow: "Manual review required",
      existingSection: "Existing Book Section",
      authorPlaceholder: "Separate multiple authors with semicolons",
      selectChapterAria: "Select chapter {number}",
      titleAria: "Bibliographic title for chapter {number}",
      authorsAria: "Authors for chapter {number}",
      startPageAria: "Printed start page for chapter {number}",
      endPageAria: "Printed end page for chapter {number}",
      notIdentified: "Not identified",
      confirmMoveExisting: "Move Existing Chapters under Book",
      confirmKeepIndependent: "Update Independent Book Sections",
      confirmCreateParents: "Create Book Attachments",
      confirmCreateSections: "Create Independent Book Sections",
      continuePrompt: "Continue writing to Zotero?",
      collectionAdd: "Collections: add the Book's current collections.",
      collectionKeep: "Collections: keep existing memberships without adding any.",
      collectionNone: "Collections: do not add any.",
      cancelledLibrary: "Cancelled. No Zotero library changes were made.",
      cancelledPrepared: "Cancelled. Temporary PDFs will be removed; no Zotero library changes were made.",
      completedMove: "Completed. Moved {count} existing chapter PDFs under the original Book. Their empty Book Section wrappers were moved to the Trash; no PDF was regenerated or copied.",
      completedNormalize: "Completed. Updated {count} independent Book Sections. {collections} Structural numbers remain outside the citation titles.",
      collectionsAdded: "The chapters were added to the Book's collections.",
      collectionsUnchanged: "Collection memberships were not changed.",
      completedParents: "Completed. Created {count} chapter PDFs under the original Book; cite the parent Book.",
      completedSections: "Completed. Created {count} independent Book Sections with chapter PDFs. {collections} Structural numbers remain outside the citation titles."
    },
    "zh-CN": {
      windowTitle: "\u62C6\u7AE0\u9884\u89C8",
      previewTitle: "\u62C6\u7AE0\u9884\u89C8",
      loading: "\u6B63\u5728\u8F7D\u5165\u9884\u89C8\u2026",
      previewFailed: "\u9884\u89C8\u8F7D\u5165\u5931\u8D25\uFF1A{message}",
      outputTopology: "\u8F93\u51FA\u65B9\u5F0F",
      parentAttachments: "\u653E\u5728\u539F Book \u4E0B",
      independentSections: "\u751F\u6210\u72EC\u7ACB\u7AE0\u8282\u6761\u76EE",
      inheritCollections: "\u52A0\u5165\u6BCD\u672C\u6240\u5728\u5206\u7C7B\uFF08{count}\uFF09",
      pdf: "PDF",
      totalPages: "\u603B\u9875\u6570",
      chapterCount: "\u7AE0\u8282\u6570",
      source: "\u8BC6\u522B\u6765\u6E90",
      selected: "\u5DF2\u9009\u62E9",
      notesRange: "Notes \u8303\u56F4",
      operation: "\u672C\u6B21\u64CD\u4F5C",
      chooseChapters: "\u9009\u62E9\u9700\u8981\u5904\u7406\u7684\u7AE0\u8282",
      selectAll: "\u5168\u9009",
      selectFinest: "\u9009\u62E9\u6700\u7EC6\u5C42\u7EA7",
      selectNone: "\u5168\u4E0D\u9009",
      select: "\u9009\u62E9",
      position: "\u4F4D\u7F6E",
      bibliographicTitle: "\u5F15\u7528\u6807\u9898",
      chapterAuthors: "\u7AE0\u8282\u4F5C\u8005\uFF08\u5206\u53F7\u5206\u9694\uFF09",
      printedPages: "\u5F15\u7528\u9875\u7801",
      physicalPages: "PDF \u7269\u7406\u9875\uFF08\u53EA\u8BFB\uFF09",
      needsReview: "\u9700\u8981\u4EBA\u5DE5\u786E\u8BA4",
      notWritten: "\u5C1A\u672A\u5199\u5165 Zotero\u3002",
      close: "\u5173\u95ED",
      processSelected: "\u5904\u7406\u6240\u9009\u7AE0\u8282\u2026",
      repairBookmarks: "\u4FEE\u590D\u76EE\u5F55\u4E66\u7B7E\u2026",
      repairingBookmarks: "\u6B63\u5728\u9A8C\u8BC1\u5E76\u66FF\u6362 PDF \u539F\u751F\u4E66\u7B7E\u2026\u2026",
      repairBookmarksFailed: "\u76EE\u5F55\u4E66\u7B7E\u4FEE\u590D\u5931\u8D25\uFF1A{message}",
      repairBookmarksDone: "\u539F\u751F\u4E66\u7B7E\u5DF2\u4FEE\u590D\u3002\u5907\u4EFD\u6587\u4EF6\uFF1A{path}",
      sourceOutline: "PDF \u539F\u751F\u4E66\u7B7E",
      sourcePrinted: "\u5370\u5237\u76EE\u5F55\uFF08PDF.js\uFF09",
      sourceAi: "AI \u8F85\u52A9\u76EE\u5F55\u8BC6\u522B",
      sourceCatalog: "\u4E66\u76EE\u5143\u6570\u636E\u76EE\u5F55\uFF08ISBN\uFF09",
      sourceChoiceTitle: "\u9009\u62E9\u7AE0\u8282\u8BC6\u522B\u6765\u6E90",
      sourceChoiceMessage: "\u8FD9\u4E2A PDF \u542B\u6709\u539F\u751F\u4E66\u7B7E\u3002\u8BF7\u9009\u62E9\u7528\u54EA\u4E00\u79CD\u6765\u6E90\u786E\u5B9A\u7AE0\u8282\u8FB9\u754C\u3002",
      sourceChoiceNoOutlineMessage: "\u8FD9\u4E2A PDF \u6CA1\u6709\u53EF\u7528\u7684\u539F\u751F\u4E66\u7B7E\u3002\u8BF7\u9009\u62E9\u672C\u5730\u5370\u5237\u76EE\u5F55\u3001AI \u8F85\u52A9\u8BC6\u522B\uFF0C\u6216 ISBN \u53EF\u7528\u65F6\u7684\u540C\u7248\u672C\u4E66\u76EE\u76EE\u5F55\u3002",
      aiConfigTitle: "AI \u8F85\u52A9\u76EE\u5F55\u8BC6\u522B",
      aiProvider: "\u670D\u52A1\u63D0\u4F9B\u65B9",
      aiEndpoint: "\u63A5\u53E3\u5730\u5740",
      aiModel: "\u6A21\u578B",
      aiApiKey: "API key",
      aiPageRange: "\u53D1\u9001\u7684 PDF \u7269\u7406\u9875",
      aiPageRangeNote: "\u53EF\u7F16\u8F91\uFF0C\u4F8B\u5982 7-18, 350-352\uFF08\u6700\u591A 40 \u9875\uFF09",
      aiRememberKey: "\u5728 Zotero \u504F\u597D\u8BBE\u7F6E\u4E2D\u4FDD\u7559\u8FD9\u4E2A API key",
      aiPrivacyHeading: "\u5C06\u79BB\u5F00\u672C\u673A\u7684\u6570\u636E",
      aiWholePdfDisclosure: "\u5C06\u628A\u5B8C\u6574 PDF\u300A{filename}\u300B\uFF08{pages} \u9875\uFF0C{size} MB\uFF09\u4F5C\u4E3A\u539F\u751F PDF \u6587\u6863\u53D1\u9001\u7ED9\u6240\u9009\u670D\u52A1\u3002Zotero \u5143\u6570\u636E\u4E0E\u6279\u6CE8\u4E0D\u4F1A\u53D1\u9001\u3002",
      aiSamplePdfDisclosure: "\u5C06\u4ECE\u300A{filename}\u300B\u4E34\u65F6\u751F\u6210\u4EC5\u542B\u6E90 PDF \u7269\u7406\u9875 {pages} \u7684 PDF \u5E76\u53D1\u9001\u3002\u5B8C\u6574\u6E90\u6587\u4EF6\u3001Zotero \u5143\u6570\u636E\u4E0E\u6279\u6CE8\u4E0D\u4F1A\u53D1\u9001\u3002",
      aiDirectModeDisclosure: "\u53D1\u9001\u524D\u4E0D\u8FD0\u884C\u672C\u5730\u76EE\u5F55\u626B\u63CF\u3002\u5FEB\u901F\u6A21\u5F0F\u8981\u6C42\u6837\u672C\u4E2D\u5305\u542B\u5B8C\u6574\u76EE\u5F55\uFF0C\u5E76\u80FD\u786E\u8BA4\u81F3\u5C11\u4E00\u4E2A\u9875\u7801\u951A\u70B9\u3002",
      aiWholePdfConsent: "\u6211\u6388\u6743\u6B64\u6B21\u5206\u6790\u53D1\u9001\u4E0A\u8FF0 PDF \u6570\u636E\u7ED9\u6240\u9009\u670D\u52A1\u3002",
      aiSendWholePdf: "\u53D1\u9001\u5E76\u8BC6\u522B",
      aiInputMode: "AI \u8F93\u5165\u8303\u56F4",
      aiInputFast: "\u5FEB\u901F\u8BC6\u522B\u2014\u2014\u524D 30 \u4E2A PDF \u7269\u7406\u9875\uFF08\u9ED8\u8BA4\uFF09",
      aiInputFull: "\u5B8C\u6574 PDF",
      aiInputManual: "\u624B\u52A8\u6307\u5B9A\u6E90 PDF \u9875\u6BB5",
      aiNativePdfUnsupported: "\u8FD9\u4E2A\u670D\u52A1\u6CA1\u6709\u5B9A\u4E49\u539F\u751F PDF \u6587\u6863\u8F93\u5165\u3002\u8BF7\u9009\u62E9 Gemini\u3001OpenAI Responses\uFF0C\u6216\u652F\u6301 file content part \u7684\u517C\u5BB9\u63A5\u53E3\u3002",
      aiCancel: "\u53D6\u6D88",
      aiContinue: "\u5206\u6790\u8FD9\u4E9B\u9875\u9762",
      aiKeyOptional: "\u672C\u5730 OpenAI-compatible \u63A5\u53E3\u53EF\u7559\u7A7A\uFF1BOllama \u4E0D\u9700\u8981\u586B\u5199",
      aiConfigInvalid: "\u8BF7\u68C0\u67E5\u670D\u52A1\u914D\u7F6E\u5E76\u786E\u8BA4\u9875\u9762\u4F20\u8F93\u8303\u56F4\u3002",
      aiProgressHeadline: "AI \u8F85\u52A9\u76EE\u5F55\u8BC6\u522B",
      aiUploadingDocument: "\u6B63\u5728\u4E0A\u4F20\u83B7\u51C6\u53D1\u9001\u7684 PDF \u6587\u6863\uFF1A{completed}/{total} MB",
      aiEncodingDocument: "\u6B63\u5728\u51C6\u5907\u83B7\u51C6\u53D1\u9001\u7684 PDF \u6587\u6863\u2026\u2026",
      aiWaitingForDocument: "PDF \u6587\u6863\u5DF2\u53D1\u9001\u81F3 {provider}\uFF0C\u6B63\u5728\u7B49\u5F85\u8FD4\u56DE\u76EE\u5F55\u2026\u2026",
      aiCleaningRemoteFile: "AI \u5DF2\u8FD4\u56DE\uFF0C\u6B63\u5728\u5220\u9664\u670D\u52A1\u7AEF\u4E34\u65F6 PDF \u526F\u672C\u2026\u2026",
      aiValidating: "AI \u5DF2\u8FD4\u56DE\uFF0C\u6B63\u5728\u672C\u5730\u6838\u9A8C\u7AE0\u8282\u8FB9\u754C\u2026\u2026",
      aiDone: "AI \u76EE\u5F55\u8BC6\u522B\u5B8C\u6210\uFF0C\u6B63\u5728\u6253\u5F00\u9884\u89C8\u2026\u2026",
      aiFailedProgress: "AI \u76EE\u5F55\u8BC6\u522B\u5DF2\u505C\u6B62\uFF1A{message}",
      aiUnavailable: "AI \u8F85\u52A9\u76EE\u5F55\u8BC6\u522B\u5931\u8D25\uFF1A{message}",
      catalogUnavailable: "\u4E66\u76EE\u5143\u6570\u636E\u76EE\u5F55\u67E5\u8BE2\u5931\u8D25\uFF1A{message}",
      printedNeedsOcr: "\u8FD9\u4E2A PDF \u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u6587\u672C\u5C42\uFF0C\u65E0\u6CD5\u5206\u6790\u5370\u5237\u76EE\u5F55\u3002\u8BF7\u5148\u8FD0\u884C OCR\uFF0C\u518D\u91CD\u8BD5\u3002",
      printedUnavailable: "\u65E0\u6CD5\u4ECE\u5370\u5237\u76EE\u5F55\u5EFA\u7ACB\u53EF\u9760\u7684\u7AE0\u8282\u8FB9\u754C\uFF1A{message}",
      choosePdfTitle: "\u9009\u62E9 PDF",
      choosePdfMessage: "\u8BE5 Book \u6761\u76EE\u4E0B\u6709\u591A\u4E2A\u672C\u5730 PDF\uFF0C\u8BF7\u9009\u62E9\u672C\u6B21\u5206\u6790\u7684\u6587\u4EF6\u3002",
      recoveryTitle: "\u68C0\u6D4B\u5230\u4E0A\u6B21\u64CD\u4F5C\u7684\u6062\u590D\u8BB0\u5F55",
      recoveryMessage: "\u4EE5\u4E0B\u4F4D\u7F6E\u5B58\u5728\u4E2D\u65AD\u64CD\u4F5C\u7559\u4E0B\u7684 recovery journal\uFF1A\n{paths}\n\n\u9664\u975E\u4F60\u5DF2\u7ECF\u6838\u5BF9 Zotero \u6761\u76EE\uFF0C\u5426\u5219\u8BF7\u505C\u6B62\u3002\u4EBA\u5DE5\u786E\u8BA4\u540E\u53EF\u5220\u9664\u8BB0\u5F55\u5E76\u7EE7\u7EED\u3002",
      recoveryStop: "\u505C\u6B62\u5E76\u4FDD\u7559\u6062\u590D\u8BB0\u5F55",
      recoveryDiscard: "\u5220\u9664\u6062\u590D\u8BB0\u5F55\u5E76\u7EE7\u7EED",
      splitBookMenu: "\u62C6\u5206\u4E3A\u7AE0\u8282\u2026",
      splitPdfMenu: "\u62C6\u5206\u6B64 PDF\u2026",
      originalBookPdfs: "\u539F Book \u4E0B\u7684 PDF",
      independentBookSections: "\u72EC\u7ACB Book Section",
      atLeastOne: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u7AE0",
      rangeConflict: "\u6240\u9009\u7AE0\u8282\u5B58\u5728\u91CD\u53E0\u3001\u540C\u9875\u8D77\u70B9\u6216\u9006\u5E8F\u3002\u8BF7\u53D6\u6D88\u51B2\u7A81\u6761\u76EE\u540E\u518D\u5199\u5165\u3002",
      moveExisting: "\u5C06\u6240\u9009\u73B0\u6709\u7AE0\u8282\u79FB\u5165\u6BCD\u672C\u2026",
      normalizeExisting: "\u6574\u7406\u6240\u9009\u72EC\u7ACB\u7AE0\u8282\u2026",
      createParentCount: "\u751F\u6210 {count} \u4E2A\u6BCD\u672C\u9644\u4EF6\u2026",
      createSectionCount: "\u751F\u6210 {count} \u4E2A\u72EC\u7ACB\u7AE0\u8282\u2026",
      controllerUnavailable: "\u5199\u5165\u63A7\u5236\u5668\u4E0D\u53EF\u7528\uFF0C\u8BF7\u5173\u95ED\u5E76\u91CD\u65B0\u6253\u5F00\u9884\u89C8\u3002",
      processing: "\u6B63\u5728\u5904\u7406\u6240\u9009\u7AE0\u8282\u2026",
      processingStatus: "\u6B63\u5728\u5904\u7406\u7AE0\u8282\uFF1B\u786E\u8BA4\u540E\u624D\u4F1A\u5199\u5165 Zotero\uFF0C\u5931\u8D25\u65F6\u81EA\u52A8\u56DE\u6EDA\u3002",
      completed: "\u5DF2\u5B8C\u6210",
      createFailed: "\u521B\u5EFA\u5931\u8D25\uFF1A{message}",
      sourceTitle: "\u76EE\u5F55\u539F\u6587\uFF1A{title}",
      confidenceHigh: "\u5DF2\u81EA\u52A8\u6838\u9A8C",
      confidenceMedium: "\u8BF7\u5FEB\u901F\u6838\u5BF9",
      confidenceLow: "\u9700\u8981\u4EBA\u5DE5\u786E\u8BA4",
      existingSection: "\u5DF2\u6709\u72EC\u7ACB\u7AE0\u8282",
      authorPlaceholder: "\u591A\u4F4D\u4F5C\u8005\u7528\u5206\u53F7\u5206\u9694",
      selectChapterAria: "\u9009\u62E9\u7B2C {number} \u4E2A\u7AE0\u8282",
      titleAria: "\u7B2C {number} \u7AE0\u5F15\u7528\u6807\u9898",
      authorsAria: "\u7B2C {number} \u7AE0\u4F5C\u8005",
      startPageAria: "\u7B2C {number} \u7AE0\u5370\u5237\u8D77\u59CB\u9875",
      endPageAria: "\u7B2C {number} \u7AE0\u5370\u5237\u7ED3\u675F\u9875",
      notIdentified: "\u672A\u8BC6\u522B",
      confirmMoveExisting: "\u5C06\u73B0\u6709\u7AE0\u8282\u79FB\u5165\u6BCD\u672C",
      confirmKeepIndependent: "\u6574\u7406\u72EC\u7ACB\u7AE0\u8282",
      confirmCreateParents: "\u521B\u5EFA\u6BCD\u672C\u9644\u4EF6",
      confirmCreateSections: "\u521B\u5EFA\u72EC\u7ACB\u7AE0\u8282",
      continuePrompt: "\u7EE7\u7EED\u5199\u5165 Zotero\uFF1F",
      collectionAdd: "\u5206\u7C7B\uFF1A\u52A0\u5165\u6BCD\u672C\u5F53\u524D\u6240\u5728\u5206\u7C7B\u3002",
      collectionKeep: "\u5206\u7C7B\uFF1A\u4FDD\u6301\u73B0\u6709\u5206\u7C7B\uFF0C\u4E0D\u81EA\u52A8\u6DFB\u52A0\u3002",
      collectionNone: "\u5206\u7C7B\uFF1A\u4E0D\u81EA\u52A8\u52A0\u5165\u4EFB\u4F55\u5206\u7C7B\u3002",
      cancelledLibrary: "\u5DF2\u53D6\u6D88\uFF1AZotero \u6587\u5E93\u672A\u53D1\u751F\u5199\u5165\u3002",
      cancelledPrepared: "\u5DF2\u53D6\u6D88\uFF1A\u4E34\u65F6 PDF \u5C06\u88AB\u5220\u9664\uFF0CZotero \u6587\u5E93\u672A\u53D1\u751F\u5199\u5165\u3002",
      completedMove: "\u5B8C\u6210\uFF1A\u5DF2\u5C06 {count} \u4E2A\u73B0\u6709\u7AE0\u8282 PDF \u79FB\u5230\u539F Book \u6761\u76EE\u4E0B\uFF1B\u7A7A\u7684 Book Section wrapper \u5DF2\u79FB\u5165\u56DE\u6536\u7AD9\uFF0C\u6CA1\u6709\u91CD\u65B0\u5207\u5206\u6216\u590D\u5236 PDF\u3002",
      completedNormalize: "\u5B8C\u6210\uFF1A\u5DF2\u6574\u7406 {count} \u4E2A\u72EC\u7ACB Book Section\u3002{collections}\u5F15\u7528\u6807\u9898\u4E0D\u542B\u7ED3\u6784\u5E8F\u53F7\u3002",
      collectionsAdded: "\u7AE0\u8282\u5DF2\u52A0\u5165\u6BCD\u672C\u6240\u5728\u5206\u7C7B\u3002",
      collectionsUnchanged: "\u6CA1\u6709\u81EA\u52A8\u6539\u53D8\u5206\u7C7B\u3002",
      completedParents: "\u5B8C\u6210\uFF1A\u5DF2\u5728\u539F Book \u6761\u76EE\u4E0B\u521B\u5EFA {count} \u4E2A\u7AE0\u8282 PDF\uFF1B\u5F15\u7528\u65F6\u4F7F\u7528\u6BCD\u672C\u4E66\u76EE\u3002",
      completedSections: "\u5B8C\u6210\uFF1A\u5DF2\u521B\u5EFA {count} \u4E2A\u72EC\u7ACB Book Section \u548C\u7AE0\u8282 PDF\u3002{collections}\u5F15\u7528\u6807\u9898\u4E0D\u542B\u7ED3\u6784\u5E8F\u53F7\u3002"
    }
  };
  function uiLanguage(locale) {
    return locale?.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
  }
  function t(language, key, variables = {}) {
    return strings[language][key].replace(
      /\{([A-Za-z][A-Za-z0-9]*)\}/gu,
      (_match, name) => String(variables[name] ?? `{${name}}`)
    );
  }

  // src/zotero/preferences.ts
  var PREFS = {
    provider: "extensions.zotero-book-splitter.ai.provider",
    endpoint: "extensions.zotero-book-splitter.ai.endpoint",
    model: "extensions.zotero-book-splitter.ai.model",
    apiKey: "extensions.zotero-book-splitter.ai.apiKey",
    rememberApiKey: "extensions.zotero-book-splitter.ai.rememberApiKey",
    catalogEnabled: "extensions.zotero-book-splitter.catalog.enabled"
  };
  var DEFAULT_CONFIG = {
    provider: "openai",
    endpoint: "https://api.openai.com/v1/responses",
    model: "gpt-5.6",
    apiKey: ""
  };
  function stringPref(key, fallback) {
    const value = Zotero.Prefs.get(key, true);
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }
  function boolPref(key, fallback) {
    const value = Zotero.Prefs.get(key, true);
    return typeof value === "boolean" ? value : fallback;
  }
  function loadAiPreferences() {
    const rawProvider = stringPref(PREFS.provider, DEFAULT_CONFIG.provider);
    const provider = ["openai", "openai-compatible", "gemini", "ollama"].includes(rawProvider) ? rawProvider : DEFAULT_CONFIG.provider;
    const rememberApiKey = boolPref(PREFS.rememberApiKey, false);
    return {
      config: {
        provider,
        endpoint: stringPref(PREFS.endpoint, DEFAULT_CONFIG.endpoint),
        model: stringPref(PREFS.model, DEFAULT_CONFIG.model),
        apiKey: rememberApiKey ? stringPref(PREFS.apiKey, "") : ""
      },
      rememberApiKey
    };
  }
  function saveAiPreferences(config, rememberApiKey) {
    Zotero.Prefs.set(PREFS.provider, config.provider, true);
    Zotero.Prefs.set(PREFS.endpoint, config.endpoint, true);
    Zotero.Prefs.set(PREFS.model, config.model, true);
    Zotero.Prefs.set(PREFS.rememberApiKey, rememberApiKey, true);
    if (rememberApiKey) Zotero.Prefs.set(PREFS.apiKey, config.apiKey, true);
    else Zotero.Prefs.clear(PREFS.apiKey, true);
  }
  function catalogLookupEnabled() {
    return boolPref(PREFS.catalogEnabled, true);
  }
  function put(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }
  function putCheckboxLabel(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    element.label = value;
    element.setAttribute("label", value);
  }
  function initPreferencePane() {
    const language = uiLanguage(Services.locale?.appLocaleAsBCP47);
    put("zbs-prefs-ai-heading", language === "zh-CN" ? "AI \u76EE\u5F55\u8BC6\u522B" : "AI contents recognition");
    put("zbs-prefs-provider-label", t(language, "aiProvider"));
    put("zbs-prefs-endpoint-label", t(language, "aiEndpoint"));
    put("zbs-prefs-model-label", t(language, "aiModel"));
    put("zbs-prefs-key-label", language === "zh-CN" ? "API key" : "API key");
    const remember = document.getElementById("zbs-prefs-remember-key");
    putCheckboxLabel(
      "zbs-prefs-remember-key",
      language === "zh-CN" ? "\u5728\u6B64 Zotero \u914D\u7F6E\u4E2D\u4FDD\u7559 API key" : "Remember the API key in this Zotero profile"
    );
    put("zbs-prefs-key-warning", language === "zh-CN" ? "API key \u4F1A\u4FDD\u5B58\u5728 Zotero \u7684\u672C\u673A\u504F\u597D\u8BBE\u7F6E\u4E2D\uFF1B\u53D6\u6D88\u52FE\u9009\u4F1A\u6E05\u9664\u5DF2\u4FDD\u5B58\u7684 key\u3002" : "The API key is stored in Zotero's local preferences. Clearing this option removes the saved key.");
    remember?.addEventListener("command", () => {
      if (!remember.checked) {
        Zotero.Prefs.clear(PREFS.apiKey, true);
      }
    });
    put("zbs-prefs-catalog-heading", language === "zh-CN" ? "\u5916\u90E8\u76EE\u5F55\u5143\u6570\u636E" : "External contents metadata");
    putCheckboxLabel(
      "zbs-prefs-catalog-enabled",
      language === "zh-CN" ? "\u5141\u8BB8\u6309 ISBN \u67E5\u8BE2\u540C\u7248\u672C\u7AE0\u8282\u76EE\u5F55" : "Allow edition-aware chapter lookup by ISBN"
    );
  }
  if (typeof window !== "undefined") {
    window.ZoteroBookSplitterPreferences = { initPreferencePane };
  }
  return __toCommonJS(preferences_exports);
})();
