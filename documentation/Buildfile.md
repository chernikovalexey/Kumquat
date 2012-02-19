#Kumquat Buildfile

This file has no extension and is placed in root. The its main purpose is to store extension's important information.
Inherently, it's the same thing as [Chrome manifest](http://code.google.com/chrome/extensions/manifest.html) 
(by the way, you should be familiar with manifest specification before filling the Buildfile), but with a few
modifications to simplify them. Buildfile is a necessary thing, if you use command line's build command. This command
parses information exactly from the build file. So, command line builder takes information from the Buildfile, handles it
to lead it to manifest specifiation and creates manifest.json in root, containing absolutely valid Chrome Manifest.

---

##General format

Buidlfile's content is ordinary JSON. Almost everything is the same as in 
[Manifest](http://code.google.com/chrome/extensions/manifest.html).

###Differences:

__icons__

Partitially, it's the same object as in manifest, but you should specify only file's name
(and optionally its extension) without long pathes to them.

Due to all icons are placed in `resources/images/icons/`, path to icon omitting is possible.

So, in Buildfile the following entry will be absolutely correct:

```
"icons": {
  "16": "icon16",
  "48": "icon48",
  "128": "icon128"
}
```

Instead of manifest's entry:

```
"icons": {
  "16": "resources/images/icons/icon16.png",
  "48": "resources/images/icons/icon48.png",
  "128": "resources/images/icons/icon128.png"
}
```

You may have noticed that if icons have .png extension, it's not necessary to specify it, but if it ISN't .png, you MUST
specify it.

So, if we have .gif icons:

```
"icons": {
  "16": "icon16.gif",
  "48": "icon48.gif",
  "128": "icon128.gif"
}
```

The same but in manifest:

```
"icons": {
  "16": "resources/images/icons/icon16.gif",
  "48": "resources/images/icons/icon48.gif",
  "128": "resources/images/icons/icon128.gif"
}
```

---

__contents_scripts__

It is an array of object, where each object consists of three properties: css, js, matches. The only difference between
Buildfile and manifest is that here it's necessary just to assign js and css to true or false.

The same code in Buildfile:

```
"content_scripts": [{
  "css": true,
  "js": true,
  "matches": ["*://*/*"]
}]
```

Analogue of the upper example in manifest:

```
"content_scripts": [{
  "css": [
    "resources/styles/pages/common/main.css", 
    "resources/styles/pages/internal/content.css"
  ],
  "js": [
    "src/lib/prevel.js",
    "src/kernel/kernel.js"
  ],
  "matches": ["*://*/*"]
}]
```

---

__browser_action__

It has two interesting propreties: icon and popup. By other words, icon and path to a html file which opens when on 
extension icon clicked.

In `icon` you shouldn't specify path and specifying the extension is optional (if it's .png).
`popup` must be equals to true or false, command line builder automatically substitutes boolean with path to html file.

This html file is `pages/public/window.html`, javascript files for this are in `src/hub/window/`. It is an ordinary 
hub.

In Buildfile:

```
"browser_action" : {
  "icon": "icon_ba",
  "default_title": "Open the window",
  "popup": true
}
```

In manifest:

```
"browser_action" : {
  "icon": "resources/images/icons/icon_ba",
  "default_title": "Open the window",
  "popup": "pages/public/window.html"
}
```

---


__page_action__

It's completely the same as `browser_action`, except object name.

In Buildfile:

```
"page_action" : {
  "icon": "icon_ba",
  "default_title": "Open the window",
  "popup": true
}
```

In manifest:

```
"page_action" : {
  "icon": "resources/images/icons/icon_ba",
  "default_title": "Open the window",
  "popup": "pages/public/window.html"
}
```
---

__background_page__

In Buildfile it's boolean instead of string in manifest.

In Buidlfile:

```
"background_page": true
```

In manifest:

```
"background_page": ""
```

---

__options_page__

In Buildfile it's boolean instead of string in manifest.

In Buidlfile:

```
"options_page": true
```

In manifest:

```
"options_page": ""
```

---

##Creating a simple Buidlfile

