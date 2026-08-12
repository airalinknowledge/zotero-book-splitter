var ZoteroBookSplitter;
var chromeHandle;

function log(message) {
  Zotero.debug(`Zotero Book Splitter: ${message}`);
}

function install() {
  log("Installed");
}

async function startup({ id, version, rootURI }) {
  log(`Starting ${version}`);
  const addonManagerStartup = Cc[
    "@mozilla.org/addons/addon-manager-startup;1"
  ].getService(Ci.amIAddonManagerStartup);
  chromeHandle = addonManagerStartup.registerChrome(
    Services.io.newURI(`${rootURI}manifest.json`),
    [["content", "zotero-book-splitter", "content/"]],
  );
  Services.scriptloader.loadSubScript(`${rootURI}content/plugin.js`);
  await ZoteroBookSplitter.init({ id, version, rootURI });
  ZoteroBookSplitter.addToAllWindows();
}

function onMainWindowLoad({ window }) {
  ZoteroBookSplitter?.addToWindow(window);
}

function onMainWindowUnload({ window }) {
  ZoteroBookSplitter?.removeFromWindow(window);
}

function shutdown() {
  log("Shutting down");
  ZoteroBookSplitter?.removeFromAllWindows();
  ZoteroBookSplitter = undefined;
  chromeHandle?.destruct();
  chromeHandle = undefined;
}

function uninstall() {
  log("Uninstalled");
}
