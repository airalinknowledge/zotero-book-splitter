"use strict";
(() => {
  // src/zotero/safeConsole.ts
  function formatValue(value) {
    if (typeof value === "string") return value;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    try {
      return JSON.stringify(value) ?? String(value);
    } catch {
      return String(value);
    }
  }
  function emit(level, values) {
    try {
      const root = globalThis;
      root.Zotero?.debug?.(
        `[Zotero Book Splitter / PDF runtime / ${level}] ${values.map(formatValue).join(" ")}`
      );
    } catch {
    }
  }
  function log(...values) {
    emit("log", values);
  }
  function warn(...values) {
    emit("warn", values);
  }
  function error(...values) {
    emit("error", values);
  }
  var console = Object.freeze({
    debug: log,
    error,
    info: log,
    log,
    trace: log,
    warn
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
      moveExisting: "Move selected chapters under the Book (no PDF created)\u2026",
      normalizeExisting: "Update selected Book Sections (no PDF created)\u2026",
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
      existingSection: "Existing \u00b7 will not regenerate",
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
      moveExisting: "\u5C06\u6240\u9009\u73B0\u6709\u7AE0\u8282\u79FB\u5165\u6BCD\u672C\uFF08\u4E0D\u751F\u6210 PDF\uFF09\u2026",
      normalizeExisting: "\u6574\u7406\u6240\u9009\u72EC\u7ACB\u7AE0\u8282\uFF08\u4E0D\u751F\u6210 PDF\uFF09\u2026",
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
      existingSection: "\u5DF2\u6709\u7AE0\u8282 \u00b7 \u4E0D\u4F1A\u91CD\u65B0\u751F\u6210",
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
  function t(language, key, variables = {}) {
    return strings[language][key].replace(
      /\{([A-Za-z][A-Za-z0-9]*)\}/gu,
      (_match, name) => String(variables[name] ?? `{${name}}`)
    );
  }

  // src/core/outline.ts
  function findRangeSelectionIssues(sections, selectedIndexes) {
    const issues = [];
    const indexes = [...new Set(selectedIndexes)].sort((left, right) => left - right);
    let previous = null;
    for (const index of indexes) {
      const section = sections[index];
      if (!section || !Number.isInteger(section.startPageIndex) || !Number.isInteger(section.endPageIndex) || section.startPageIndex < 0 || section.endPageIndex < section.startPageIndex) {
        issues.push({
          code: "invalid-range",
          firstIndex: index,
          secondIndex: index
        });
        continue;
      }
      const current = {
        index,
        start: section.startPageIndex,
        end: section.endPageIndex
      };
      if (previous) {
        const code = current.start === previous.start ? "duplicate-start" : current.start < previous.start ? "non-monotonic" : current.start <= previous.end ? "overlap" : null;
        if (code) {
          issues.push({
            code,
            firstIndex: previous.index,
            secondIndex: current.index
          });
        }
      }
      previous = current;
    }
    return issues;
  }

  // src/core/hierarchySelection.ts
  function normalizedDepth(item) {
    return Math.max(0, Math.trunc(item?.depth ?? 0));
  }
  function hierarchyPositionLabels(items) {
    const counters = [];
    return items.map((item) => {
      const depth = normalizedDepth(item);
      while (counters.length <= depth) counters.push(0);
      counters.length = depth + 1;
      counters[depth] = (counters[depth] ?? 0) + 1;
      for (let index = 0; index < depth; index += 1) {
        if (!counters[index]) counters[index] = 1;
      }
      return counters.join(".");
    });
  }
  function topLevelSelection(items) {
    return items.flatMap(
      (item, index) => normalizedDepth(item) === 0 ? [index] : []
    );
  }
  function finestLevelSelection(items) {
    return items.flatMap((item, index) => {
      const depth = normalizedDepth(item);
      const nextDepth = normalizedDepth(items[index + 1]);
      return index + 1 < items.length && nextDepth > depth ? [] : [index];
    });
  }
  function coStartPreference(item, index) {
    const hasAuthor = (item.authors?.length ?? 0) > 0 ? 1e6 : 0;
    const chapterMarker = /^(?:\d+[.、]|[一二三四五六七八九十百]+[、.]|chapter\s+\w+)\s*/iu.test(
      item.title?.trim() ?? ""
    ) ? 1e5 : 0;
    const specificity = Math.min(item.title?.trim().length ?? 0, 1e4);
    return hasAuthor + chapterMarker + specificity + index / 1e5;
  }
  function exclusiveCoStartSelection(items, selectedIndexes) {
    const selected = [...new Set(selectedIndexes)].sort((left, right) => left - right);
    const bestByStart = /* @__PURE__ */ new Map();
    for (const index of selected) {
      const item = items[index];
      if (!item) continue;
      const current = bestByStart.get(item.startPageIndex);
      if (current === void 0 || coStartPreference(item, index) > coStartPreference(items[current], current)) {
        bestByStart.set(item.startPageIndex, index);
      }
    }
    return [...bestByStart.values()].sort((left, right) => left - right);
  }
  function toggleCoStartSelection(items, selectedIndexes, targetIndex, checked) {
    const selected = new Set(selectedIndexes);
    if (!checked) {
      selected.delete(targetIndex);
      return [...selected].sort((left, right) => left - right);
    }
    const target = items[targetIndex];
    if (!target) return [...selected].sort((left, right) => left - right);
    for (const [index, item] of items.entries()) {
      if (index !== targetIndex && item.startPageIndex === target.startPageIndex) {
        selected.delete(index);
      }
    }
    selected.add(targetIndex);
    return [...selected].sort((left, right) => left - right);
  }
  function toggleHierarchySelection(items, selectedIndexes, targetIndex, checked) {
    const selected = new Set(selectedIndexes);
    if (!checked) {
      selected.delete(targetIndex);
      return [...selected].sort((left, right) => left - right);
    }
    const targetDepth = normalizedDepth(items[targetIndex]);
    let descendantEnd = targetIndex + 1;
    while (descendantEnd < items.length && normalizedDepth(items[descendantEnd]) > targetDepth) {
      selected.delete(descendantEnd);
      descendantEnd += 1;
    }
    let childDepth = targetDepth;
    for (let index = targetIndex - 1; index >= 0 && childDepth > 0; index -= 1) {
      const depth = normalizedDepth(items[index]);
      if (depth < childDepth) {
        selected.delete(index);
        childDepth = depth;
      }
    }
    selected.add(targetIndex);
    return [...selected].sort((left, right) => left - right);
  }

  // src/zotero/preview.ts
  var HTML_NS = "http://www.w3.org/1999/xhtml";
  var activeLanguage = "en-US";
  function log2(message) {
    try {
      const dialogWindow = window;
      const controller = dialogWindow.arguments?.[1];
      controller?.log?.(message);
    } catch (_) {
    }
  }
  function htmlElement(tagName) {
    return document.createElementNS(HTML_NS, tagName);
  }
  function element(id) {
    const found = document.getElementById(id);
    if (!found) throw new Error(`Preview element #${id} is missing`);
    return found;
  }
  function putText(id, value) {
    element(id).textContent = String(value ?? "\u2014");
  }
  function translateStatic(language) {
    const labels = [
      ["preview-title", "previewTitle"],
      ["output-legend", "outputTopology"],
      ["parent-mode-label", "parentAttachments"],
      ["section-mode-label", "independentSections"],
      ["summary-pdf-label", "pdf"],
      ["summary-pages-label", "totalPages"],
      ["summary-chapters-label", "chapterCount"],
      ["summary-source-label", "source"],
      ["summary-selected-label", "selected"],
      ["summary-notes-label", "notesRange"],
      ["summary-operation-label", "operation"],
      ["selection-label", "chooseChapters"],
      ["select-all", "selectAll"],
      ["select-none", "selectNone"],
      ["select-heading", "select"],
      ["position-heading", "position"],
      ["title-heading", "bibliographicTitle"],
      ["authors-heading", "chapterAuthors"],
      ["printed-pages-heading", "printedPages"],
      ["physical-pages-heading", "physicalPages"],
      ["commit-status", "notWritten"],
      ["close-button", "close"],
      ["repair-bookmarks-button", "repairBookmarks"],
      ["commit-button", "processSelected"]
    ];
    document.documentElement.setAttribute("title", t(language, "windowTitle"));
    for (const [id, key] of labels) putText(id, t(language, key));
  }
  function parseModel(payload) {
    if (!payload) throw new Error("No preview data was supplied");
    const value = typeof payload === "string" ? JSON.parse(payload) : payload;
    if (!value || typeof value !== "object") {
      throw new Error("Invalid preview data");
    }
    const model = value;
    activeLanguage = model.language === "zh-CN" ? "zh-CN" : "en-US";
    if (!Array.isArray(model.proposedSections)) {
      throw new Error("Invalid preview data: proposedSections is missing");
    }
    if (!Array.isArray(model.warnings)) {
      throw new Error("Invalid preview data: warnings is missing");
    }
    return model;
  }
  function showFailure(error2) {
    const message = error2 instanceof Error ? error2.message : String(error2);
    const status = document.getElementById("preview-status");
    if (status) {
      status.hidden = false;
      status.classList.add("error");
      status.textContent = t(activeLanguage, "previewFailed", { message });
    }
    try {
      putText("book-title", t(activeLanguage, "previewFailed", { message }));
      log2(`UI failed: ${message}`);
    } catch (_) {
    }
  }
  function showCommitStatus(message, kind) {
    const status = element("commit-status");
    status.textContent = message;
    status.classList.toggle("success", kind === "success");
    status.classList.toggle("error", kind === "error");
  }
  function installCommitHandler(controller, model) {
    const button = element("commit-button");
    const repairButton = element("repair-bookmarks-button");
    repairButton.hidden = model.documentType === "epub";
    const interactive = Array.from(
      document.querySelectorAll(
        "input[name='output-mode'], #inherit-collections, .chapter-select, .metadata-input, #select-all, #select-none"
      )
    );
    const selectedIndexes = () => Array.from(document.querySelectorAll(".chapter-select:checked")).map((checkbox) => Number(checkbox.dataset.index)).filter(Number.isInteger);
    const hierarchyMode = model.sourceType !== "outline" && model.proposedSections.some((section) => section.depth > 0);
    const setSelectedIndexes = (indexes) => {
      const selected = new Set(indexes);
      for (const checkbox of document.querySelectorAll(
        ".chapter-select"
      )) {
        checkbox.checked = selected.has(Number(checkbox.dataset.index));
      }
    };
    const selectedMode = () => {
      const checked = document.querySelector(
        "input[name='output-mode']:checked"
      );
      return checked?.value === "bookSections" ? "bookSections" : "parentAttachments";
    };
    const inheritCollections = () => selectedMode() === "bookSections" && element("inherit-collections").checked;
    const selectedMetadata = (indexes) => indexes.map((sourceIndex) => {
      const title = document.querySelector(
        `.chapter-title[data-index='${sourceIndex}']`
      )?.value ?? "";
      const authorText = document.querySelector(
        `.chapter-authors[data-index='${sourceIndex}']`
      )?.value ?? "";
      const startPageLabel = document.querySelector(
        `.chapter-start-label[data-index='${sourceIndex}']`
      )?.value ?? "";
      const endPageLabel = document.querySelector(
        `.chapter-end-label[data-index='${sourceIndex}']`
      )?.value ?? "";
      return {
        sourceIndex,
        title,
        authors: authorText.split(/\s*;\s*/u).map((author) => author.trim()).filter(Boolean),
        startPageLabel,
        endPageLabel
      };
    });
    const updateControls = () => {
      const indexes = selectedIndexes();
      const rangeIssues = findRangeSelectionIssues(model.proposedSections, indexes);
      const mode = selectedMode();
      const existing = indexes.filter(
        (index) => model.existingGeneratedIndexes.includes(index)
      ).length;
      const collectionCheckbox = element(
        "inherit-collections"
      );
      if (model.bookCollectionCount === 0) collectionCheckbox.checked = false;
      collectionCheckbox.disabled = mode !== "bookSections" || model.bookCollectionCount === 0;
      putText(
        "collection-label",
        t(model.language, "inheritCollections", {
          count: model.bookCollectionCount
        })
      );
      putText("selected-count", `${indexes.length} / ${model.proposedSections.length}`);
      putText(
        "operation-mode",
        model.documentType === "epub" && mode === "parentAttachments"
          ? model.language === "zh-CN" ? "原 Book 下的 EPUB" : "EPUBs under the original Book"
          : t(
            model.language,
            mode === "parentAttachments" ? "originalBookPdfs" : "independentBookSections"
          )
      );
      if (rangeIssues.length > 0) {
        button.textContent = t(model.language, "rangeConflict");
        button.disabled = true;
        const status2 = element("commit-status");
        status2.dataset.rangeConflict = "true";
        showCommitStatus(t(model.language, "rangeConflict"), "error");
        return;
      }
      const status = element("commit-status");
      if (status.dataset.rangeConflict === "true") {
        delete status.dataset.rangeConflict;
        showCommitStatus(t(model.language, "notWritten"), "normal");
      }
      if (indexes.length === 0) button.textContent = t(model.language, "atLeastOne");
      else if (existing === indexes.length) {
        button.textContent = mode === "parentAttachments" ? t(model.language, "moveExisting") : t(model.language, "normalizeExisting");
      } else {
        button.textContent = mode === "parentAttachments" ? t(model.language, "createParentCount", { count: indexes.length }) : t(model.language, "createSectionCount", { count: indexes.length });
      }
      button.disabled = indexes.length === 0;
    };
    for (const control of interactive) control.addEventListener("change", updateControls);
    element("select-all").addEventListener("click", () => {
      const requested = hierarchyMode ? finestLevelSelection(model.proposedSections) : model.proposedSections.map((_, index) => index);
      setSelectedIndexes(exclusiveCoStartSelection(model.proposedSections, requested));
      updateControls();
    });
    element("select-none").addEventListener("click", () => {
      for (const checkbox of document.querySelectorAll(".chapter-select")) {
        checkbox.checked = false;
      }
      updateControls();
    });
    if (!controller || typeof controller.commit !== "function") {
      button.disabled = true;
      repairButton.disabled = true;
      showCommitStatus(t(model.language, "controllerUnavailable"), "error");
      return;
    }
    repairButton.disabled = typeof controller.repair !== "function";
    repairButton.addEventListener("click", async () => {
      if (typeof controller.repair !== "function") return;
      const allIndexes = model.proposedSections.map((_, index) => index);
      button.disabled = true;
      repairButton.disabled = true;
      for (const control of interactive) control.disabled = true;
      repairButton.textContent = t(model.language, "repairingBookmarks");
      showCommitStatus(t(model.language, "repairingBookmarks"), "normal");
      try {
        const result = await controller.repair(selectedMetadata(allIndexes));
        showCommitStatus(result.message, result.status === "created" ? "success" : "normal");
      } catch (error2) {
        const message = error2 instanceof Error ? error2.message : String(error2);
        showCommitStatus(t(model.language, "repairBookmarksFailed", { message }), "error");
        log2(`bookmark repair failed: ${message}`);
      } finally {
        for (const control of interactive) control.disabled = false;
        repairButton.disabled = false;
        repairButton.textContent = t(model.language, "repairBookmarks");
        updateControls();
      }
    });
    button.addEventListener("click", async () => {
      const request = {
        mode: selectedMode(),
        inheritCollections: inheritCollections(),
        selectedIndexes: selectedIndexes(),
        metadata: []
      };
      if (request.selectedIndexes.length === 0) return;
      request.metadata = selectedMetadata(request.selectedIndexes);
      button.disabled = true;
      for (const control of interactive) control.disabled = true;
      button.textContent = t(model.language, "processing");
      showCommitStatus(t(model.language, "processingStatus"), "normal");
      try {
        const result = await controller.commit(request);
        if (result.status === "created") {
          button.textContent = t(model.language, "completed");
          showCommitStatus(result.message, "success");
        } else {
          for (const control of interactive) control.disabled = false;
          updateControls();
          showCommitStatus(result.message, "normal");
        }
      } catch (error2) {
        const message = error2 instanceof Error ? error2.message : String(error2);
        for (const control of interactive) control.disabled = false;
        updateControls();
        showCommitStatus(t(model.language, "createFailed", { message }), "error");
        log2(`commit failed: ${message}`);
      }
    });
    updateControls();
  }
  function start() {
    try {
      const dialogWindow = window;
      const model = parseModel(dialogWindow.arguments?.[0]);
      translateStatic(model.language);
      if (model.documentType === "epub") {
        putText("summary-pdf-label", "EPUB");
        putText("summary-pages-label", model.language === "zh-CN" ? "正文文档数" : "Spine documents");
        putText("printed-pages-heading", model.language === "zh-CN" ? "页码／章节位置" : "Pages / chapter position");
        putText("physical-pages-heading", model.language === "zh-CN" ? "EPUB 正文文档" : "EPUB spine documents");
      }
      const controller = dialogWindow.arguments?.[1];
      const sections = model.proposedSections;
      if (model.citationTitles.length !== sections.length) {
        throw new Error("Citation-title count does not match proposed sections");
      }
      if (model.chapterMetadata.length !== sections.length) {
        throw new Error("Chapter-metadata count does not match proposed sections");
      }
      const hierarchyMode = model.sourceType !== "outline" && sections.some((section) => section.depth > 0);
      const defaultSelection = new Set(
        exclusiveCoStartSelection(
          sections,
          hierarchyMode ? topLevelSelection(sections) : sections.map((_, index) => index)
        )
      );
      const positionLabels = hierarchyMode ? hierarchyPositionLabels(sections) : sections.map((_, index) => String(index + 1).padStart(2, "0"));
      if (hierarchyMode) {
        putText("select-all", t(model.language, "selectFinest"));
      }
      putText("book-title", model.bookTitle);
      putText("pdf-title", model.pdfTitle);
      putText("total-pages", model.totalPages);
      putText("section-count", sections.length);
      putText(
        "source-type",
        model.sourceType === "epub-navigation"
          ? model.language === "zh-CN" ? "EPUB 原生目录" : "Native EPUB navigation"
          : t(
            model.language,
            model.sourceType === "ai-toc" ? "sourceAi" : model.sourceType === "printed-toc" ? "sourcePrinted" : model.sourceType === "catalog-toc" ? "sourceCatalog" : "sourceOutline"
          )
      );
      putText(
        "notes-range",
        model.notesRange ? `${model.notesRange.startPageLabel}\u2013${model.notesRange.endPageLabel}` : t(model.language, "notIdentified")
      );
      const tableBody = element("sections");
      for (const [index, section] of sections.entries()) {
        const row = htmlElement("tr");
        const selectCell = htmlElement("td");
        const checkbox = htmlElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = defaultSelection.has(index);
        checkbox.className = "chapter-select";
        checkbox.dataset.index = String(index);
        checkbox.setAttribute(
          "aria-label",
          t(model.language, "selectChapterAria", { number: index + 1 })
        );
        checkbox.addEventListener("change", () => {
          const currentlySelected = Array.from(
            document.querySelectorAll(".chapter-select:checked")
          ).map((candidate) => Number(candidate.dataset.index)).filter(Number.isInteger);
          const hierarchyAdjusted = hierarchyMode ? toggleHierarchySelection(
            sections,
            currentlySelected,
            index,
            checkbox.checked
          ) : currentlySelected;
          const adjusted = new Set(
            toggleCoStartSelection(
              sections,
              hierarchyAdjusted,
              index,
              checkbox.checked
            )
          );
          for (const candidate of document.querySelectorAll(
            ".chapter-select"
          )) {
            candidate.checked = adjusted.has(Number(candidate.dataset.index));
          }
        });
        selectCell.appendChild(checkbox);
        row.appendChild(selectCell);
        const positionCell = htmlElement("td");
        positionCell.textContent = positionLabels[index] ?? String(index + 1);
        row.appendChild(positionCell);
        const titleCell = htmlElement("td");
        if (hierarchyMode && section.depth > 0) {
          titleCell.classList.add("hierarchy-title");
          titleCell.style.paddingInlineStart = `${10 + section.depth * 18}px`;
        }
        const metadata = model.chapterMetadata[index];
        if (!metadata) throw new Error(`Missing metadata for chapter ${index + 1}`);
        const titleInput = htmlElement("input");
        titleInput.type = "text";
        titleInput.className = "metadata-input chapter-title";
        titleInput.dataset.index = String(index);
        titleInput.value = metadata.title;
        titleInput.setAttribute(
          "aria-label",
          t(model.language, "titleAria", { number: index + 1 })
        );
        titleCell.appendChild(titleInput);
        if ((model.citationTitles[index] ?? section.title) !== section.title) {
          const sourceTitle = htmlElement("small");
          sourceTitle.className = "source-title";
          sourceTitle.textContent = t(model.language, "sourceTitle", {
            title: section.title
          });
          titleCell.appendChild(sourceTitle);
        }
        const confidence = htmlElement("span");
        confidence.className = `confidence-badge confidence-${metadata.confidence}`;
        confidence.textContent = metadata.confidence === "high" ? t(model.language, "confidenceHigh") : metadata.confidence === "medium" ? t(model.language, "confidenceMedium") : t(model.language, "confidenceLow");
        if (metadata.warnings.length) {
          confidence.classList.add("has-detail");
          confidence.title = metadata.warnings.join("\n");
        }
        titleCell.appendChild(confidence);
        if (model.existingGeneratedIndexes.includes(index)) {
          const badge = htmlElement("span");
          badge.className = "existing-badge";
          badge.textContent = t(model.language, "existingSection");
          titleCell.appendChild(badge);
        }
        row.appendChild(titleCell);
        const authorsCell = htmlElement("td");
        const authorsInput = htmlElement("input");
        authorsInput.type = "text";
        authorsInput.className = "metadata-input chapter-authors";
        authorsInput.dataset.index = String(index);
        authorsInput.value = metadata.authors.join("; ");
        authorsInput.placeholder = t(model.language, "authorPlaceholder");
        authorsInput.setAttribute(
          "aria-label",
          t(model.language, "authorsAria", { number: index + 1 })
        );
        authorsCell.appendChild(authorsInput);
        row.appendChild(authorsCell);
        const pagesCell = htmlElement("td");
        pagesCell.className = "page-range-editor";
        const startInput = htmlElement("input");
        startInput.type = "text";
        startInput.className = "metadata-input chapter-start-label";
        startInput.dataset.index = String(index);
        startInput.value = metadata.startPageLabel;
        startInput.setAttribute(
          "aria-label",
          t(model.language, "startPageAria", { number: index + 1 })
        );
        const separator = htmlElement("span");
        separator.textContent = "\u2013";
        const endInput = htmlElement("input");
        endInput.type = "text";
        endInput.className = "metadata-input chapter-end-label";
        endInput.dataset.index = String(index);
        endInput.value = metadata.endPageLabel;
        endInput.setAttribute(
          "aria-label",
          t(model.language, "endPageAria", { number: index + 1 })
        );
        pagesCell.append(startInput, separator, endInput);
        row.appendChild(pagesCell);
        const physicalCell = htmlElement("td");
        physicalCell.textContent = model.documentType === "epub"
          ? `${section.spineStartIndex + 1}\u2013${section.spineEndIndex + 1} (${section.pageCount})`
          : `${section.startPageIndex + 1}\u2013${section.endPageIndex + 1} (${section.pageCount})`;
        row.appendChild(physicalCell);
        tableBody.appendChild(row);
      }
      // Document-level notes stay available on the source chip rather than
      // occupying a panel of their own.
      if (model.warnings.length) {
        const sourceCell = document.getElementById("source-type");
        if (sourceCell) sourceCell.title = model.warnings.join("\n\n");
      }
      element("preview-status").hidden = true;
      element("close-button").addEventListener("click", () => window.close());
      installCommitHandler(controller, model);
      document.documentElement.setAttribute("data-preview-ready", "true");
    } catch (error2) {
      showFailure(error2);
    }
  }
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
