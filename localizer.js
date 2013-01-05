
var AsyncLocalizer = require('./lib/async.js');
var SyncLocalizer = require('./lib/sync.js');

function Localizer(settings) {
  if (!(this instanceof Localizer)) return new Localizer(settings);

  this.async = new AsyncLocalizer(settings);
  this.sync = new SyncLocalizer(settings);
}
module.exports = Localizer;

Localizer.prototype.resolve = function (from, input, callback) {
  if (callback) {
    this.async.resolve(from, input, callback);
  } else {
    return this.sync.resolve(from, input);
  }
};
