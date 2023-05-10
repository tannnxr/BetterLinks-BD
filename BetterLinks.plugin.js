/**
 * @name BetterLinks
 * @author tamner#6279
 * @description Changes links to be more visually appealing.
 * @version 1.0.0
 */


const linkMap = {}

const defaultSettings = {
  "firstVisit": true,
}

let links = [];

const patchLinks = () => {
  links = document.querySelectorAll(".anchor-1X4H4q");
  links.forEach(link => {
    try {
      if (link.getAttribute("tabindex") !== null && link.getAttribute("tabindex") === "-1") return;
      let url = undefined;
      if (link.getAttribute("href") !== null) {
        url = new URL(link.getAttribute("href"));
      } else if (link.getAttribute("title") !== null) {
        url = new URL(link.getAttribute("title"));
      }
      const domain = url.hostname;
      if (linkMap[domain]) {
        link.innerHTML = linkMap[domain];
        link.classList.add("betterlinks");
      } else {
        link.innerHTML = domain;
        link.classList.add("betterlinks");
      }
    } catch (e) { }
  });
}

const validateSettings = () => {
  const settings = BdApi.loadData('BetterLinks', "settings")
  if (settings === undefined) {
    BdApi.saveData('BetterLinks', "settings", defaultSettings)
  } else {
    for (const key in defaultSettings) {
      if (settings[key] === undefined) {
        settings[key] = defaultSettings[key];
      }
    }
    BdApi.saveData('BetterLinks', "settings", settings)
  }
  return settings;
}

module.exports = class ExamplePlugin {
  constructor() {
    this.initialized = false;
    this.request = require("request");
    this.settings = validateSettings();
    this.observer = null // Last ditch effort for this to work.
    this.listeners = [
      document.onwheel = () => {
        patchLinks();
      }
    ]
  }

  start() {
    if (this.settings.firstVisit) {
      BdApi.alert("BetterLinks", "Thanks for installing BetterLinks! You can change the settings in the plugin settings.")
      this.settings.firstVisit = false;
      BdApi.saveData('BetterLinks', "settings", this.settings)
    }
    BdApi.DOM.addStyle("BetterLinks", `.betterlinks { 
      color: #c9cde5 !important;
      text-decoration: none;
      font-size: 12.5px;
      line-height: 1.375rem;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 3px;
      background: #3d4270; }`);
    patchLinks();
  }

  stop() {
    // Called when the plugin is deactivated
  }
  onSwitch() {
    // BdApi.UI.showToast("Switched Channel/Server", { type: "success" });
    patchLinks();
  }
}