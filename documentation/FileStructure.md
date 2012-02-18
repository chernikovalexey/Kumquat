#File System Structure

Of course, in Kumquat there're some internal parts, which are not necessary to comprise in the final release (
before loading to the Chrome Web Store). In future Kumquat will offer you this functionality (building the final
release and archiving it) through the command line. Precisely.

__Tree:__

* [__/cl/__](https://github.com/chernikovalexey/Kumquat/tree/master/cl) - command line API
  * [__./Common/__](https://github.com/chernikovalexey/Kumquat/tree/master/cl/Common) - common functions of CL, used everywhere (within CL)
  * [__./Handlers/__](https://github.com/chernikovalexey/Kumquat/tree/master/cl/Handlers) - commands handlers
  * [__./cl.js__](https://github.com/chernikovalexey/Kumquat/tree/master/cl/cl.js) - router (exactly, it's being called from command line)

* [__/resources/__](https://github.com/chernikovalexey/Kumquat/tree/master/resources) - static files, related to design
  * [__./images/__](https://github.com/chernikovalexey/Kumquat/tree/master/resources/images) - images, icons
    * [__./icons/__](https://github.com/chernikovalexey/Kumquat/tree/master/resources/images/icons) - icons only
  * [__./styles/__](https://github.com/chernikovalexey/Kumquat/tree/master/resources/styles) - css styles
  
* [__/pages/__](https://github.com/chernikovalexey/Kumquat/tree/master/pages) - html files
  * [__./internal/__](https://github.com/chernikovalexey/Kumquat/tree/master/pages/internal) - html, which represents extension's background processes
  * [__./public/__](https://github.com/chernikovalexey/Kumquat/tree/master/pages/public) - html, which will be available through the browser window
  
* [__/src/__](https://github.com/chernikovalexey/Kumquat/tree/master/src) - js files
  * [__./kernel/__](https://github.com/chernikovalexey/Kumquat/tree/master/src/kernel) - kernel files; routing, initialising
  * [__./ext/__](https://github.com/chernikovalexey/Kumquat/tree/master/src/ext) - modules and extensions
  * [__./ui/__](https://github.com/chernikovalexey/Kumquat/tree/master/src/ui) - UI elements
  * [__./hub/__](https://github.com/chernikovalexey/Kumquat/tree/master/src/hub) - MVC srtucture for `../pages/public/`
  * [__./lib/__](https://github.com/chernikovalexey/Kumquat/tree/master/src/lib) - external libraries used in Kumquat

* __Buildfile__ - [Kumquat Buildfile](https://github.com/chernikovalexey/Kumquat/tree/master/documentation/Buildfile.md)

---

Directory useful only while developing is __cl__. So before archiving the final release of the extension, you can
exclude __cl__.