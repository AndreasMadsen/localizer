
var fs = require('fs');
var path = require('path');
var util = require('util');

var CoreLocalizer = require('./core.js');

function SyncLocalizer(settings) {
  CoreLocalizer.call(this, settings);
}
util.inherits(SyncLocalizer, CoreLocalizer);
module.exports = SyncLocalizer;

//
// Filesystem
// - these methods reads the filesystem and use this.realpath
//   be sure to check the security before and after use of these methods.
//
SyncLocalizer.prototype.fileType = function (filepath) {
  var err = null;
  var res = null;

  // .statSync throws the error, catch it in a try/catch
  try {
    fs.statSync(this.realpath(filepath));
  } catch (e) {
    if (e) err = e;
  }

  // ENOENT is the error code for not found and should not be treated
  // as an error.
  if (err && err.code !== 'ENOENT') throw err;

  return {
    exists:    err ? false : true,
    file:      err ? false : res.isFile(),
    directory: err ? false : res.isDirectory()
  };
};

SyncLocalizer.prototype.readPackage = function (moduleRoot) {
  var packagePath = path.resolve(moduleRoot, 'package.json');
  var realPackagePath = this.realpath(packagePath);

  var stat = this.fileType(packagePath);

  // A package.json file do not exist, default response is ''
  if (!stat.file) return '';

  // Read the content of the package.json file
  var content = JSON.parse(fs.readFileSync(realPackagePath, 'utf8'));

  // return content.main and default to '' if main property don't exists
  if (content.hasOwnProperty('main')) {
    return content.main;
  } else {
    return '';
  }
};

//
// This resolve method is called from public API layer
//
SyncLocalizer.prototype.resolve = function (from, input) {
  // input is not a module search
  if (this.isFilepath(input)) {

    // resolve input to filepath
    return this.resolveInput(path.resolve(path.sep, from, input));
  } else {
    // split input intro a module name and a module subpath
    var split = this.splitModuleInput(input);

    // find module directory
    var moduleRoot = this.resolveModuleRoot(from, split.name);

    // append the input path and resolve it to a filepath
    return this.resolveInput(moduleRoot + split.path);
  }
};
