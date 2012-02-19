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

