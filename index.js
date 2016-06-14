var rread = require("rreaddir-sync"),
	u = require("util"),
	p = require("upath");

function EModLoader(options){
	var filter = (options && u.isRegExp(options.filter)) ? options.filter : /^.*\.js$/,
		requirer = (options && u.isFunction(options.requirer)) ? options.requirer : require;

	function getModulePath(path, mainPath){
		return p.dirname(p.resolve(path).replace(new RegExp("^" + p.resolve(mainPath)), ""));
	}

	function filterPath(path){
		return filter.test(p.resolve(path));
	}

	this.getModules = function(path){
		return rread(p.resolve(path), [rread.ONLY_FILE,filterPath])
				.sort((b,a)=>b>a)
				.map((ep)=>{
					var absPath = p.resolve(ep);
					return {path: getModulePath(ep, path), module: requirer(absPath), absolute: absPath, name: p.basename(absPath).replace(/\.[^\.]*$/, "")};
				});
	}

	this.loadModules = function(path, callback){
		this.getModules(path).forEach((m)=>{callback(m.path, m.module)});
	}
}
var exp = (options)=>new EModLoader(options);

module.exports = exp;