
var test = require('tap').test;
var localizer = require('../localizer.js');
var api = localizer({ root: __dirname });

var testManifest = require('./test.json');

// the test.json file is grouped
Object.keys(testManifest).forEach(function (groupName) {
  test(groupName, function (t) {

    // each groupe has some test, with a description
    Object.keys(testManifest[groupName]).forEach(function (description) {

      // each test has an info object
      var info = testManifest[groupName][description];

      // the from info is by default '/'
      info.from = info.from || '/';

      // if info.path is null, create a info error object
      if (info.path === null && info.error === undefined) {
        info.error = {
          message: "Cannot find module '" + info.input + "'",
          code: 'MODULE_NOT_FOUND'
        };
      }

      t.test(description, function (t) {

        // test the async call type
        api.resolve(info.from, info.input, function (err, filepath) {

          if (info.error) {
            t.ok(err instanceof Error, 'resolve returned an error');
            t.equal(err.message, info.error.message);
            t.equal(err.code, info.error.code);
          } else {
            t.equal(err, null);
          }

          // in case of an error, info.path is null, otherwice it is the
          // expected filepath
          t.equal(filepath, info.path);

          t.end();
        });
      });
    });

    t.end();
  });
});
