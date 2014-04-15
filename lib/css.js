var path = require('path'),
    util = require('util'),
    cssParse = require('css').parse,
    cssStringify = require('css').stringify,
    CleanCSS = require('clean-css'),
    css = require('cmd-util').css,
    ast = require('cmd-util').ast,
    iduri = require('cmd-util').iduri,
    gutil = require('gulp-util');


exports.css2jsParser = function(file, cb, options) {
  var data = file.contents.toString('utf8'),
      filename = path.relative(file.cwd, file.path),
      id = unixy(options.idleading + filename.replace(/\.js$/, ''));

  data = css2js(data, id, options, file);
  file.contents = new Buffer(data);
  file.path += '.js';

  cb(null, file);
};

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

  var banner = util.format('/*! define %s */', id);
  data = [banner, ret].join('\n');
  file.contents = new Buffer(data);

  cb(null, file);
};

// helpers
function unixy(uri) {
  return uri.replace(/\\/g, '/');
}

function parseRules (rules, prefix) {
  return rules.map(function(o){
    if (o.selectors) {
      o.selectors = o.selectors.map(function(selector){
        if (selector.indexOf(':root') === 0) {
          return ':root ' + prefix + selector.replace(':root', ' ');
        }
        return prefix + selector;
      });
    }
    if (o.rules) {
      o.rules = parseRules(o.rules, prefix);
    }
    return o;
  });
}

function css2js(code, id, options, file) {
  // ex. arale/widget/1.0.0/ => arale-widget-1_0_0
  var styleId = unixy((options || {}).idleading || '')
    .replace(/\/$/, '')
    .replace(/\//g, '-')
    .replace(/\./g, '_');
  var prefix = ['.', styleId, ' '].join(''),
      filename = path.relative(file.cwd, file.path);

  var addStyleBox = false;
  if (Array.isArray(options.styleBox) && options.styleBox.length) {
    options.styleBox.some(function(name){
      if (name === filename) {
        addStyleBox = true;
        return addStyleBox;
      }
    });
  } else if (options.styleBox) {
    addStyleBox = true;
  }

  //styleBox only apply on inline css
  if (addStyleBox && styleId && !file.isNull()) {
    var data = cssParse(code);
    data.stylesheet.rules = parseRules(data.stylesheet.rules, prefix);
    code = cssStringify(data);
  }

  //remove comment and format
  code = new CleanCSS({
            keepSpecialComments: 0,
            removeEmpty: true,
            noAdvanced: true
          }).minify(code);
  
  var tpl = [
      'define("%s", [], function() {',
      "  seajs.importStyle('%s');",
      '});'
  ].join('\n');

  code = code.split(/\r\n|\r|\n/).map(function(line){
    return line.replace(/\\/g, '\\\\');
  }).join('\n');

  code = util.format(tpl, id, code.replace(/\'/g, '\\\''));
  return code;
}