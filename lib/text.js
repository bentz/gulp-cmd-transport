var path = require('path'),
    util = require('util'),
    ast = require('cmd-util').ast;

exports.html2jsParser = function(file, cb, options){
  var data = file.contents.toString('utf8'),
      filename = path.relative(file.cwd, file.path),
      id = unixy(options.idleading + filename.replace(/\.js$/, ''));
  
  data = html2js(data, id);
  data = ast.getAst(data).print_to_string(options.uglify);
  file.contents = new Buffer(data);
  file.path += '.js';
  
  return cb(null, file);
};

//helpers
function unixy(uri) {
  return uri.replace(/\\/g, '/');
}

function html2js(code, id) {
  var tpl = 'define("%s", [], "%s");';

  code = code.split(/\r\n|\r|\n/).map(function(line) {
    return line.replace(/\\/g, '\\\\');
  }).join('\n');

  code = util.format(tpl, id, code.replace(/\"/g, '\\\"'));
  return code;
}