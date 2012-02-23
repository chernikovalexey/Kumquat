{
  "icons": {
    "16": "icon16",
    "48": "icon48",
    "128": "icon128"
  },
  "content_scripts": [{
    "css": true,
    "js": true,
    "matches": ["*://*/*"]
  }],
  "browser_action": {
    "icon": "icon128",
    "default_title": "Open the window",
    "popup": true
  },
  "background_page": true,
  "options_page": true,

  "name": "Kumquat Ext Framework",
  "version": "1.0.0",

  "description": "Browser extensions development kit for Chrome",
  "default_locale": "en"
}