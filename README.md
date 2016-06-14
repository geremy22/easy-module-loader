Easy and dynamic nodejs module loader

###Install
`npm install easy-module-loader`

###Usage
With easy-module-loader you can load NodeJS files from a directory and all sub-directories by instanciating an EModLoader object.
```
var EModLoader = require("easy-module-loader"),
    loader = EModLoader(); //or new EModLoader();
loader.getModules("./test");
/*
Assuming this file is placed in folder /home/dev/easytest with the following structure:
/home/dev/easytest/test/mod1.js
/home/dev/easytest/test/subMod
/home/dev/easytest/test/subMod/mod2.js
/home/dev/easytest/test/subMod/subSub
/home/dev/easytest/test/subMod/subSub/mod3.js

mod1.js, mod2.js and mod3.js simply exports an object like {mod: 'mod#'} 
indicating their module number, getModules will return:
[ 
  { path: '/',
    module: { mod: 'mod1' },
    absolute: '/home/dev/easytest/test/mod1.js',
    name: 'mod1' },
  { path: '/subMod',
    module: { mod: 'mod2' },
    absolute: '/home/dev/easytest/test/subMod/mod2.js',
    name: 'mod2' }
  { path: '/subMod/subSub'
    module: { mod: 'mod3' },
    absolute: '/home/dev/easytest/test/subMod/subSub/mod3.js',
    name: 'mod3' }
]*/
```
By default, an EModLoader will use NodeJS `require` function to load each JS files in the directory passed to `getModules`, but you can redefine this behaviour by passing an options object to the EModLoader constructor.
`EModLoader([options])`
Options object may have the following properties:
* `options.requirer` (Function(absPath)) This function will receive each absolute path and must resolve and return the module object, by default will use NodeJS `require` function.
* `options.filter` (RegExp) This RegExp will filter each file path who should be loaded, by default will filter all JS files: /.*\.js$/
* `options.order` (Function(before,after)) Basic order function, used for `Array#sort` the list of paths. By default will order alphabetically: (b,a)=>b>a;
* `options.depth` (Number) Number indicating how deep you want to list. See [rreaddir-sync](https://github.com/geremy22/rreaddir-sync#arguments)

###Reference
* `EModLoader#getModules(dirPath)` Retrieves an array of modules (see [module object](#module-object)) included in `dirPath` and all sub-directories, according to EModLoader options.
* `EModLoader#loadModules(dirPath,callback)` Gets modules from `dirPath` and executes the `callback` for each of these by passing  path and module object. This function is intended for use with express:
```
var app = require("express")(),
    loader = require("easy-module-loader")();
    
loader.loadModules("./rest/api", app.use.bind(app));

app.listen(3000);
/*
Assuming you have the following structure
/home/thisFile.js
/home/rest/api
/home/rest/api/router1.js
/home/rest/api/subRouter/router2.js

This express app will listening "/" and "/subRouter" 
by using the routers (or any middleware function) exported by router1.js and router2.js
*/
```

###Module Object
A module object represents each module loaded by EModLoader. It has the following properties:
* `path`: Path relative to the main path on wich all modules are loaded. It starts after the `dirPath` you have passed to `getModules` function.
* `module`: The module object who was required by the `options.requirer` function.
* `absolute`: The absolute path of the module file, the same who was passed to the `options.requirer` function.
* `name`: The name of the file loaded without extension.

######Note: Sorry if my english is not good