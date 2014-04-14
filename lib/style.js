var path = require('path'),
    util = require('util'),
    cssParse = require('css').parse,
    cssStringify = require('css').stringify,
    css = require('cmd-util').css,
    ast = require('cmd-util').ast,
    iduri = require('cmd-util').iduri,
    gutil = require('gulp-util');

//todo

exports.cssParser = function(file, cb, options){
  var data = file.contents.toString('utf8'),
      filename = path.relative(file.cwd, file.path),
      id = unixy(options.idleading + filename.replace(/\.js$/, ''));

  data = css.parse(data);
  var ret = css.stringify(data[0].code, function(node) {
    if (node.type === 'import' && node.id) {
      if (node.id.charAt(0) === '.') {
        return node;
      }
      if (/^https?:\/\//.test(node.id)) {
        return node;
      }
      if (!iduri.isAlias(options, node.id)) {
        gutil.log('alias ' + node.id + ' not defined.');
      } else {
        node.id = iduri.parseAlias(options, node.id);
        if (!/\.css$/.test(node.id)) {
          node.id += '.css';
        }
        return node;
      }
    }
  });
};