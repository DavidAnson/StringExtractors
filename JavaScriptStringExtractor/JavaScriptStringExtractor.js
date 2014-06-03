/* jshint node: true, bitwise: true, curly: true, eqeqeq: true, forin: true, freeze: true, immed: true, indent: 4, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

"use strict";

// Require
var fs = require("fs");
var esprima = require("esprima");
var glob = require("glob");

// Visits all nodes in a parse tree
function visitAll(node) {
  if (!node) {

    // Nothing to do
    return;
  } else if (("Literal" === node.type) && ("string" === typeof(node.value))) {

    // Log string literal
    console.log(node.value.trim());
  } else if ("object" === typeof(node)) {

    // For each key/value pair...
    Object.keys(node).forEach(function (key) {
      var value = node[key];
      if (Array.isArray(value)) {

        // Visit all array elements
        value.forEach(visitAll);
      } else {

        // Visit value
        visitAll(value);
      }
    });
  }
}

// Process arguments
process.argv.splice(2).forEach(function (arg) {

  // Glob (to expand "*.js")
  glob(arg, function(err, files) {
    if (err) {
      throw err;
    }

    // Process results
    files.forEach(function(file) {

      // Check stats
      fs.stat(file, function (errr, stat) {
        if (errr) {
          throw errr;
        }

        // Check if file
        if (stat.isFile()) {

          // Read file
          fs.readFile(file, { encoding: "utf8" }, function (errrr, data) {
            if (errrr) {
              throw errrr;
            }

            // Comment-out hashbang to avoid Esprima exception
            if ("#!" === data.substring(0, 2)) {
              data = "//" + data;
            }

            try {

              // Parse contents
              var parse = esprima.parse(data, { comment: true, tolerant: true });

              // String literals
              visitAll(parse);

              // Comments
              parse.comments.forEach(function (comment) {
                  console.log(comment.value.trim());
              });
            } catch(e) {

              // Parse error
              console.error("EXCEPTION PARSING '" + file + "'");
              console.error(e);
              throw e;
            }
          });
        }
      });
    });
  });
});
