#File System Structure

Of course, in Kumquat there're some internal parts, which are not necessary to comprise in the final release (
before loading to the Chrome Web Store). In future Kumquat will offer you this functionality (building the final
release and archiving it) through the command line. Precisely.

__Tree:__

* __/cl/__ - command line API
  * __./Common/__ - common functions of CL, used everywhere (within CL)
  * __./Handlers/__ - commands handlers
  * __./cl.js__ - router (exactly, it's being called from command line)

* __/resources/__ - static files, related to design
  * __./images/__ - images, icons
    * __./icons/__ - icons only
  * __./styles/__ - css styles
  
* __/pages/__ - html files
  * __./internal/__ - html, which represents extension's background processes
  * __./public/__ - html, which will be available through the browser window
  
* __/src/__ - js files
  * __./kernel/__ - kernel files; routing, initialising
  * __./ext/__ - modules and extensions
  * __./ui/__ - UI elements
  * __./hub/__ - MVC srtucture for `../pages/public/`
  * __./lib/__ - external libraries used in Kumquat