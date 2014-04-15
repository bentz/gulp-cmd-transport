var path = require('path'),
    util = require('util'),
    handlebars = require('handlebars'),
    ast = require('cmd-util').ast,
    iduri = require('cmd-util').iduri;


exports.tplParser = function(file, cb, options){
  var data = file.contents.toString('utf8'),
      filename = path.relative(file.cwd, file.path),
      id = unixy(options.idleading + filename.replace(/\.js$/, '')),
      code = util.format('define("%s", [], "%s")', id, data.replace(/\"/g, '\\\"')),
      astCache = ast.getAst(code);

  data = astCache.print_to_string(options.uglify);
  file.contents = new Buffer(data);
  file.path += '.js';

  cb(null, file);
};

//helpers
function unixy(uri) {
  return uri.replace(/\\/g, '/');
}