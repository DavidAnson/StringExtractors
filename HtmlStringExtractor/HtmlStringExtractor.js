/* jshint node: true, bitwise: true, curly: true, eqeqeq: true, forin: true, freeze: true, immed: true, indent: 4, latedef: true, newcap: true, noarg: true, noempty: true, nonbsp: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

"use strict";

// Require
var fs = require("fs");
var url = require("url");
var htmlparser = require("htmlparser2");
var glob = require("glob");
var request = require("request");

// Process arguments
process.argv.splice(2).forEach(function (arg) {

  // Glob (to expand "*.htm")
  glob(arg, { nonull: true }, function(err, files) {
    if (err) {
      throw err;
    }

    // Process results
    files.forEach(function(file) {

      // Check stats
      fs.stat(file, function (errr, stat) {

        // Determine file/URL
        var readFunction = null;
        var parsedUrl = null;
        if (!errr && stat.isFile()) {

          // Prepare to read from file
          readFunction = function(callback) {
            fs.readFile(file, { encoding: "utf8" }, callback);
          };
        } else if (errr && (parsedUrl = url.parse(file)) && parsedUrl.protocol) {

          // Prepare to read from URL
          readFunction = function(callback) {
            request.get(file, callback);
          };
        }

        if (readFunction) {

          // Read content
          readFunction(function (errrr, fileData, urlData) {
            if (errrr) {
              throw errrr;
            }

            // Shared log function
            var onstring = function(first, second) {
              var string = (second || first).trim();
              if (string) {
                console.log(string);
              }
            };

            // Create parser
            var parser = new htmlparser.Parser({
              ontext: onstring,
              oncomment: onstring,
              onattribute: onstring
            });

            // Parse contents
            parser.write(urlData || fileData);
            parser.end();
          });
        }
      });
    });
  });
});
