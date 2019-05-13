// Default settings
var default_settings = {
  "no_commas": true
}

// Default blacklist
var default_blacklisted_sites = [
  "docs.google.com",
  "gmail.com",
  "mail.google.com",
  "outlook.com",
  "zendesk.com"
];

var debug = false;

function checkBlacklist(url, blacklist) {
  url = url.toLowerCase() || "";
  blacklist = blacklist || [];
  for (var i = blacklist.length - 1; i >= 0; i--) {
    if (url.indexOf(blacklist[i]) > -1) {
      return false;
    }
  }
  return true;
}

function injectScript(tabId, tab) {
  if (debug) {console.log("injectScript fired");}
  chrome.storage.sync.get(null, function (result) {
    if (result && result.status === "enabled" && checkBlacklist(tab.url, result.blacklist) && tab.url.indexOf("chrome-") === -1 && tab.url.indexOf("chrome://") === -1) {
      chrome.tabs.executeScript(tabId, {
        file: "js/jquery.min.js",
        runAt: "document_start"
      }, function (){
        if (debug){console.log('jQuery injected');}
        chrome.tabs.executeScript(tabId, {
          file: "js/charlie.js",
          runAt: "document_end"
        }, function (){
          if (debug){console.log('Charlie.js injected');}
        });
      });
    }
  });
}

function fixDataCorruption() {
  if (debug) { console.log("fixDataCorruption fired"); }
  chrome.storage.sync.get(null, function(result) {
    if (!result.status) {
      chrome.storage.sync.set({
        "status": "enabled"
      });
    }
    if (!result.settings) {
      chrome.storage.sync.set({
        "settings": default_settings
      });
    }
    if (!result.blacklist) {
      chrome.storage.sync.set({
        "blacklist": default_blacklisted_sites
      });
    }
  });
}

function toggleActive() {
  if (debug) { console.log("toggleActive fired"); }
  chrome.storage.sync.get("status", function(result) {
    // Get active tab
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
      var tab = tabs[0];
        // Default = enable
        if (result.status === null) {
          status = "enabled";
        } else {
          status = result.status;
        }
        if (status === "enabled") {
          icon = {
            "path": "images/disabled.png"
          };
          message = {
            "title": "Click to enable Charlie"
          };
          status = "disabled";
          // Reload page (only way to remove script effects afaik)
          chrome.tabs.update(tab.id, {url: tab.url});
        } else if (status === "disabled") {
          icon = {
            "path": "images/enabled.png"
          };
          message = {
            "title": "Click to disable Charlie"
          };
          status = "enabled";
          // Inject script (no reload needed)
          injectScript(tab.id, tab);
        }
        chrome.browserAction.setIcon(icon);
        chrome.browserAction.setTitle(message);
        chrome.storage.sync.set({
          "status": status
        });
    });
  });
}

// Listen for enable/disable
chrome.browserAction.onClicked.addListener(toggleActive);

// Check for page tab loads
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        injectScript(tabId, tab);
    }
});

// Fix data corruption @ startup
chrome.runtime.onInstalled.addListener(fixDataCorruption);
chrome.runtime.onStartup.addListener(fixDataCorruption);
