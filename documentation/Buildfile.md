#Kumquat Buildfile

This file has no extension and is placed in root. The its main purpose is to store extension's important information.
Inherently, it's the same thing as [Chrome manifest](http://code.google.com/chrome/extensions/manifest.html) 
(by the way, you should be familiar with manifest specification before filling the Buildfile), but with a few
modifications to simplify them. Buildfile is a necessary thing, if you use command line's build command. This command
parses information exactly from the build file.

---

##General format

Buidlfile's content is ordinary JSON. Almost everything is the same as in 
[Manifest](http://code.google.com/chrome/extensions/manifest.html).

###Differences:

__icons__

Partitially, it's the same object as in manifest, but you should specify only file's name
(and optionally its extension) without long pathes to them.

Due to all icons are placed in `/resources/images/icons/`, path to icon omitting is possible.

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
  "16": "/path/to/icons/icon16.png",
  "48": "/path/to/icons/icon48.png",
  "128": "/path/to/icons/icon128.png"
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

---

__contents_scripts__



---

__browser_action__



---


__page_action__



---

__background_page__



---

__options_page__



---

##Creating a simple Buidlfile

