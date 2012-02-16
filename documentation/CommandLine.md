#Command Line API Overview

Note: perhaps, it will be useful to read through [docs about the file structure]() at first, 
if you didn't do it. Moreover, knowledge about [Kumquat Build]() file will be appreciated.

It is an utility written in [Node.js]() for getting you rid of creating and deleting
modules and extensions, minifying js-files with your hands.

__Using:__

1. run the command line;
2. go to the directory with Kumquat;
3. then go to the `cl` folder;
4. execute the command: `node cl.js action parameters` (example)

So, the common way of using is:

```
cd path/to/Kumquat/cl
node cl.js action parameters
```

Where `action` can be equaled to build, create, minify, remove. And `parameters` value depends on the
chosen `action`.

__A few simple examples:__

Creating a new extension, named as translator:

```
node cl.js create ext translator
```

It will create `translator.js` in `/src/ext/`.

---

Removing an extension, named as translator:

```
node cl.js remove ext translator
```

It will remove the extension created in the previous example (`translator.js` from `/src/ext/`).

---

Building the extension:

```
node cl.js build
```

It will create and fill Chrome-compatible `manifest.json` file in root.

---

Minifying all scripts in the extension:

```
node cl.js minify *
```

It will minify (with UglifyJS) all scripts from `/src/`.

---

#Detailed review of CL functions

###create

It creates an extension or a module to prevent interactions with the file structure.

General application:

```
node cl.js create item -parameter name
```

`item` can be equaled to:

* `hub` - create a module

* `ext` - create an extension

`-parameter` is available only when `item` is `ext`, it defines if extension is directory or not.

`name` - name.

__Examples:__

Create a new hub (module):

```
node cl.js create hub new_page
```

It will create a html file in `pages/public/` - `/pages/public/new_page.html` and js files 
(router, render, handlers) in `/src/hub/new_page` to provide MVC srtucture.

---

Create a new extension (as an ordinary js-file):

```
node cl.js create ext new_ext
```

---

Create a new extension (as a separate directory, it's practical 
when extension consists of a few files, but united under the common namespace):

```
node cl.js create ext -f new_module
```

Note: it will create directory `big_ext` in `src/ext/` and it will be empty.

---

Add extensions to the created previously module.

```
node cl.js create ext new_module.new_modules_ext
```

It will create `new_modules_ext.js` in new_module directory 
(`src/ext/new_module/new_modules_ext.js`).

---

###remove

It removes an extension or a hub.

General application:

```
node cl.js remove item name
```

`item` can be equaled to:

* `hub` - remove a hub

* `ext` - remove an extension

`name` - name.

__Examples:__

Remove a hub:

```
node cl.js remove hub hub_name
```

It will remove `hub_name.html` from `/pages/public/` and the same-name directory from
`/src/hub/`.

---

Remove an extension or a module:

```
node cl.js remove ext ext_name
```

It will remove `ext_name.js` from `/src/ext/` if it exists, otherwise it will look for `ext_name`
directory and remove it, if it exists.

---

Remove an extension from the module:

```
node cl.js remove ext module_name.ext_name
```

It will remove `ext_name.js` from `/src/ext/module_name/`.

---

###minify

It makes js-files minified.

General application:

```
node cl.js minify path_to_file
```

`path_to_file` - path to the file, which will be minified, 
dot-separated starting from `src/` and without its extension.

Note: if it's necessary to minify all files, declare `path_to_file` as *.

So, if you have the following file: `/src/kernel/kernel.js`, you should declare `path_to_file` 
just as `kernel.kernel`.

__Examples:__

Minify all files:

```
node cl.js minify *
```

Minify `/src/kernel/kernel.js` only.

```
node cl.js minify kernel.kernel
```

---

###build

It creates Chrome's-compatible `manifest.json` file in root from the `Buildfile`.

General application:

```
node cl.js build
```

It has no parameters, just fill the Buildfile.

__Example:__

```
node cl.js build
```