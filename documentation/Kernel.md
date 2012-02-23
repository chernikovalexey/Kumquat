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

---

###Data container `ke.data`

It stores all extension settings, related to its work, not to storing user-data.

It has two public properties: `ke.data.kernel` and `ke.data.app`.

The second one (`ke.data.app`) is absolutely empty and it's aimed on using in hubs for storing arbitatry information.
The first one is much complicated, it consists of the following properties:

* `const` - constants. Now there are only 4: STYLE_PREFIX (equals to "s:"), 
            ROOT_PREFIX (equals to "root:"), KERNEL_DB (equals to "KE_Kernel") and CACHE_TABLE (equals to "Cache");

* `flags` - flags. Initially there is the only flag - `dom_loaded`, which equals true after DOM Loaded. You can also
            create flags manually (read further about this feature);

* `info` - current page and browser information. Has 4 properties: `url` (current url), `ver` (Chrome version),
           `lang` (Chrome interface language), `id` (extension id).

__Examples:__

```javascript
console.log(ke.data.app); // => {}
console.log(ke.data.kernel['const'].ROOT_PREFIX); // => 'root:'
console.log(ke.data.kernel['const'].CACHE_TABLE); // => 'Cache'
console.log(ke.data.kernel.info.ver); // => '17.0.963.56'
console.log(ke.data.kernel.info.lang); // => 'en-GB'
```

---

###Functions in `ke` namespace

__Current section `ke.section`:__

It's a [getter](http://ejohn.org/blog/javascript-getters-and-setters/), which contains current section (
name of the current html file without its extension).

E.g. for page "chrome-extension://extension_id/pages/public/window.html" section equals to "window".

__Extension ID `ke.extId`:__

It's a getter, too. It contains extension's id (each Chrome extension has id).

__Path to extension `ke.pathToExt`:__

Getter. It contains path to the extension. It's useful, if `chrome.extension.getURL` is not suitable to you.

__Get flag contents by its name `ke.getFlag(name)`:__

Get `name` flag's contents (true or false).

__Create a new flag `ke.createFlag(name[, default_value])`:__

It creates a new flag, if it does not exist. 

`name` - name of a new flag. `default_value` - boolean value of just-created flag, by default it's false.

```javascript
console.log(ke.getFlag('is_chrome')); // => undefined
ke.createFlag('is_chrome', true);
console.log(ke.getFlag('is_chrome')); // => true
```

__Set flag to true `ke.setFlagTrue(name)`:__

Sets `name` flag to true.

```javascript
ke.createFlag('is_chrome');
console.log(ke.getFlag('is_chrome')); // => false
ke.setFlagTrue('is_chrome');
console.log(ke.getFlag('is_chrome')); // => true
```

__Set flag to false `ke.setFlagFalse(name)`:__

Sets `name` flag to false.

```javascript
ke.createFlag('is_opera', true);
console.log(ke.getFlag('is_opera')); // => true
ke.setFlagFalse('is_opera');
console.log(ke.getFlag('is_opera')); // => false
```

__Get constant value `ke.getConst(name)`:__

Returns `name` constant value.

```javascript
console.log(ke.getConst('STYLE_PREFIX')); // => 's:'
```

---

###Kumquat DB (`ke.db`)

__Choose the database to work with `ke.db.choose(name[, size])`:__

It chooses the database for future working. It the database doesn't exist, it creates the database.

Note: before using other methods of `ke.db` you should obligatorly choose the database.

__Selected database `ke.db.selected`:__

Getter. Contains the name of the selected database (chose using the previously described method).

```javascript
ke.db.choose('test_db');
console.log(ke.db.selected); // => 'test_db'
```

__ke.db.execSql(req, replace, success, error):__

This method executes `req` for selected database (using `ke.db.choose()`). If necessary, it can replace "?" signs in
`req` to values in `replace` array accordingly. `success` and `error` are callbacks which will be fired on success
and on error of the request accordingly.

```javascript
ke.db.choose('test_db', '50 MB'); // Size of db equlals 50 MB
console.log(ke.db.selected); // => 'test_db'

// Execute this SQL merely for 'test_db' database
ke.db.execSql(
  'SELECT * FROM test_table WHERE id > ? AND name = ?',
  
  // Replace the first "?" with 782 and the second one with "row_name"
  // So SQL, inherently, equals SELECT * FROM test_table WHERE id > 782 AND name = "row_name"
  [782, 'row_name'], 
  function(result) {
    var len = result.rows.length;
    for(var key = 0; key < len; ++key) {
      console.log(result.rows.item(key));
    }
  },
  function(error) {
    console.error(error);
  }
);
```

---

###Kumquat User-Storage (`ke.us`)

__:__