/*
 * grunt-skeleton-assembler-colors
 * https://github.com/ginetta/grunt-skeleton-assembler-colors
 *
 * Copyright (c) 2015 Ginetta
 * Licensed under the MIT license.
 */

"use strict";

var _ = require("lodash");
var theo = require("theo");



var THEO_ADAPTED_TMP_PATH = ".tmp/theo/adapters/";
var THEO_GENERATED_TMP_PATH = ".tmp/theo/generated/";
var CUSTOM_THEO_TEMPLATES_PATH = __dirname + "/custom-theo-templates";

module.exports = function(grunt) {

  function generateAdaptedColorsSpec (options) {
    var colorsSpec = grunt.file.readJSON(options.src);
    var adapted = [];
    _.each(colorsSpec, function (colors, palette) {
      _.each(colors, function (color, name) {
        adapted.push({ palette: palette, name: name, value: color, category: "color", comment: "" });
      });

    });

    var finalAdapted = { theme: { properties: adapted } };

    grunt.file.write(THEO_ADAPTED_TMP_PATH + options.destName + ".json", JSON.stringify(finalAdapted, undefined, 2));
  }

  function generateSass (options) {
    theo.convert( THEO_ADAPTED_TMP_PATH + options.destName + ".json", THEO_GENERATED_TMP_PATH,
      {
        templates: ["scss"],
        templatesDirectory: CUSTOM_THEO_TEMPLATES_PATH
      }
    );
    var sassContents = grunt.file.read(THEO_GENERATED_TMP_PATH + options.destName + ".scss");
    grunt.file.write(options.destFolder + options.destName + ".scss", sassContents);
  }

  grunt.registerTask("skeleton_assembler_colors", "Grunt task that converts skeleton colors definition file into sass variables.", function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      src: "",
      destFolder: "",
      destName: ""
    });

    generateAdaptedColorsSpec(options);
    generateSass(options);
  });

};
