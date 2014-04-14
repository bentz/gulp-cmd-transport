var path = require('path'),
    util = require('util'),
    ast = require('cmd-util').ast;

exports.jsonParser = function(file, cb, options){
  var data = file.contents.toString('utf8'),
      filename = path.relative(file.cwd, file.path),
      id = unixy(options.idleading + filename.replace(/\.js$/, '')),
      code = util.format('define("%s", [], %s)', id, data);

  data = ast.getAst(code).print_to_string(options.uglify);
  file.contents = new Buffer(data);
  file.path += '.js';

  return cb(null, file);
};

//helpers
function unixy(uri) {
  return uri.replace(/\\/g, '/');
}