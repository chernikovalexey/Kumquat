#How to use Kumquat?

All html files are in `/pages/`. It's separated into two directories: `internal` and `public`. The first one stores
html, related to background processes, the second one stores all public files, which will be available from the browser. 
JS files for this pages are in `/src/hub/`. JS is separated into three files: router, render, handlers.

__For example:__

We've created a new hub from the command line. Now we have a `window` page (`/pages/public/window.html`). 
When you transit to this page, Kumquat automatically loads all necessary js 
(router.js, render.js, handlers.js) from `/src/hub/window/` and all necessary styles (main.css, window.css) from `/resources/styles/`. By the way, it's no matter whether the page is internal or 
public, the only difference is that you can't create internal pages through the command line (there're a part of the core). 
Then, after all JS files loaded, Kumquat loads "import files" (js or css which is required for the current page), it's 
possible to declare it in router.js (read further about its structure).

---

##First step: create a new hub

There're a few pre-created hubs: background (Chrome background process), content (Chrome content scripts), options (
extension options), window (for pop-up or page action). 

If you want to create a new one, please use 
[command line](https://github.com/chernikovalexey/Kumquat/blob/master/documentation/CommandLine.md) - 
it will simplify the process.

##Second step: redact HTML

After everything's created, you can redact HTML (`/pages/public/hub_you_have_created_name.html`). You can redact 
files from `/pages/internal` as well. But remember, that files created through the command line will be stored only
in `/pages/public/`.

##Third step: redact hub's JS

Go to `/src/hub/hub_you_have_created_name/` and you'll see three files: router.js, render.js, handlers.js. 

__router.js:__

It is the mainest file of these three. It organises routing, initialising and importing.

It has the following structure:

```javascript
/* Kumquat Hub hub_you_have_created_name Router
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app, {
    import: [], // What to import
             
    init: function() {
      // Your init code here
    }
  });
  
})();
```

If your hub requires some css or js, you should declare it in `import`, then fill init function. Somehow like this:

```javascript
/* Kumquat Hub hub_you_have_created_name Router
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app, {
    import: ['lib.prevel', 'kernel.kernel', 's:pages.common.main'], // What to import
             
    init: function() {
      console.log('Initialised!');
    }
  });
  
})();
```

This code will log "Initialised!" when DOM loaded and attach `/src/lib/prevel.js`, `/src/kernel/kernel.js` and 
`/resources/styles/pages/common/main.css` to the document.

__render.js:__

It just stores functions for organising page (e.g. remove some elements) and attaching events separately. 
These functions should be fired in router init.

It has the following structure:

```javascript
/* Kumquat Hub hub_you_have_created_name Render
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app.render, {
    organize: {}, // Organise page
    events: {}    // Attach events
  });
  
})();
```

__handlers.js:__

It stores all kinds of handlers for events attached with __render.js__. It made just to divide attaching and handling.

It has the following structure:

```javascript
/* Kumquat Hub hub_you_have_created_name Handlers
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app.handlers, {
    // Functions...
  });
  
})();
```

---

##Additional step: write extensions or modules

Extensions are single js files in `/src/ext/` which can be included to any hub. This is the only "legal" 
(within Kumquat, had in mind) way to provide common functionality for a few hubs at the same time.

Modules are the same extensions but placed in directories. E.g. if we have a module named "parser", it has 
its separate directory - `/src/ext/parser/`, where there should be single js files.

[Command Line](https://github.com/chernikovalexey/Kumquat/blob/master/documentation/CommandLine.md) allows creating 
alike modules, and extensions.

Extension template has the following structure:

```javascript
/* Kumquat Extension - extension_you_have_created_name
 *
**/

(function(undefined) {
  
  pl.extend(ke.ext.extension_you_have_created_name, {
    import: [] // If extension requires some css or unattached (yet) js
    
    // Your methods are here...
  });
  
})();
```

BUT: if you created a module, it will have the following structure:

```javascript
/* Kumquat Extension - module_you_have_created_name.ext
 *
**/

(function(undefined) {
  
  pl.extend(ke.ext.module_you_have_created_name.ext, {
    import: [] // Import js/css, if necessary
    
    // Your methods are here...
  });
  
})();
```

So, module, roughly speaking, is just an additional namespace (what's convenient when module is complicated).

---

##Additional step: additional kernel initialise

Tautology...

Kumquat ensures an ability to create an additional kernel init 
(the first one is integrated into `/src/kernel/kernel.js` and it's undesirable to amend it). This init will be fired om
each page load. The main advantage of it is that it's completely common and will be fired irrespective whether it's 
imported or not (you can use extensions/modules, of course, but you if using them, 
you ought to import them, had in mind).

Additional kernel init's code is placed in `/src/kernel/init.js`. In that file there's a pre-defined function (
`ke.data.kernel.save.user_init`), just write code, will be fired when dom loaded, in it.