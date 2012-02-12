#Kumquat Ext Framework

__Kumquat__ is a framework aimed on fast extensions developing for __Google Chrome__. Using it you can focus on primary tasks, 
such as describing extension's appeareance and behaviour, instead of sorting out with the file structure, routers and so on.
Literally, sorting out with the file system is unnecessary - Kumquat has a __Command Line API__, where it's possible to
create, remove modules, build extension, minify files. The other convenient side of its using is the amount of built-in
functions and methods: __[Prevel API](https://github.com/chernikovalexey/Prevel/tree/master/Docs)__ is available, plus 
there're [a few extensions](https://github.com/chernikovalexey/Kumquat/tree/master/src/ext) (they are optional to load).

###Command Line API

This API is written in __[Node.js](http://nodejs.org)__. It's aimed on getting you rid of unpleasant dealing with
the file system of the project and writing confusing routers. Everything what you will need using Kumquat is to
create a new module or an extension (Kumquat Kernel Extension, had in mind); and these two actions are available to do
within Command Line. Moreover, it supports building the project and minifying JavaScript 
(with __[UglifyJS](https://github.com/mishoo/UglifyJS)__).

__How-to create new module example:__

```
cd path/to/Kumquat/cl
node cl.js create hub translator
```