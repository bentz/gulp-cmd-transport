var gulp = require('gulp'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    es = require('event-stream'),
    path = require('path'),
    _ = require('underscore'),
    script = require('./lib/script'),
    style = require('./lib/style'),
    text = require('./lib/text'),
    json = require('./lib/json'),
    template = require('./lib/template');

const PLUGIN_NAME = 'gulp-seajs';

module.exports = function(options){
  options = _.extend({
    paths: ['sea-modules'],

    idleading: '',

    process: false,

    uglify: {
      beautify: true,
      comments: true
    },

    parsers: {
      '.js': script.jsParser,
      '.css': style.cssParser,
      '.html': text.html2jsParser,
      '.json': json.jsonParser,
      '.tpl': template.tplParser,
      '.handlebars': template.handlebarsParser
    }

  }, options || {});

  function doTransport(file, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported for ' + PLUGIN_NAME));

    gutil.log('transporting ' + path.join(file.cwd, path.relative(file.base, file.path)));

    var extname = path.extname(file.path),
        parser = options.parsers[extname];

    if (!parser) return cb(null, file);

    return parser(file, cb, options);
  }

  return es.map(doTransport);
};