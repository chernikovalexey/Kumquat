#Kernel

Apart file structure and command line API, Kumquat also suggests you all 
[functions of Prevel](https://github.com/chernikovalexey/Prevel/tree/master/Docs) available in any part of 
the extension. Moreover, Kumquat Kernel offers a few useful and convenient APIs to work with Web SQL DB, 
cache and so on.

---

###Import

__Import `ke.import(url[, files])`:__

It provides importing scripts and styles. 

You do not need to specify entire pathes, `ke.import()` automatically adds start of the path 
(/src/ for scripts and /resources/styles/ for styles) and its extension to `url`. 
So, it will transform "ext.tpl" into "/src/ext/tpl.js", and "s:pages.internal.content" into 
"/resources/styles/pages/internal/content.css".

`url` is a path to required file. If it starts with "s:", import will consider it as style, otherwise as script.
Instead of slashes ("/") in url it's necessary to use points.

`files` is an optional argument. It's required when you specify `url` in the following way: `hub.window.*` - when
after the last dot there is "*" sign. Thereby `files` is an array, contains name of files which are in directory
(considering the example: `hub/window/`).

`ke.import()` returns an instance of itself, so it's a chain function.

__Example:__

```javascript
/* The following code will attach:
 *  - /src/hub/window/router.js
 *  - /src/hub/window/render.js
 *  - /src/hub/window/handlers.js
**/
ke.import('hub.window.*', ['router', 'render', 'handlers']);


// This fragment will attach /src/ext/tpl.js to the document
ke.import('ext.tpl');

// It will attach /resources/styles/pages/common/main.css
ke.import('s:pages.common.main');

//
// OR (chain mode):

ke.import('ext.tpl')
  .import('s:pages.common.main');
```

__When done callback `ke.import().onDone(callback)`:__

`onDone` is a method of `ke.import()`, it's optional. `callback` will be fired when everything specified in 
import is loaded.

__Examples:__

```javascript
ke.import('ext.tpl').onDone(function() {
  console.log('Template engine loaded!');
});

ke.import('hub.window.*', ['router', 'render', 'handlers']).onDone(function() {
  console.log('Window hub\'s JS loaded!');
});
```

__Get loaded files `ke.import.getLoaded()`:__

It returns an array with full pathes to loaded files (both styles, and scripts).

__Example:__

```javascript
ke.import('ext.tpl');
ke.import('s:pages.common.main');

console.log(ke.import.getLoaded()); // => ['/src/ext/tpl.js', '/resources/style/pages/common/main.css']
```