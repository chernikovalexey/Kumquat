{

  // What's different from standard Chrome manifest.json
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
    "icon": "icon19",                   // optional
    "default_title": "Open the window", // optional; shown in tooltip
    "popup": true                       // optional
  },
  "page_action": {
    "icon": "foo",              // optional
    "title": "Open the window", // optional; shown in tooltip
    "popup": true               // optional
  },
  "background_page": true,
  "options_page": true,
  
  //
  // Completely equal to manifest.json standard
  
  // Required
  "name": "Kumquat Ext",
  "version": "1.0",

  // Recommended
  "description": "Browser extensions development kit for Chrome",
  "default_locale": "en"
}