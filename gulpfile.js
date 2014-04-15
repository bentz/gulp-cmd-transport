var gulp = require('gulp'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha'),
    runSeq = require('run-sequence'),
    transport = require('./'),
    jsParser = require('./lib/script').jsParser,
    css2jsParser = require('./lib/css').css2jsParser;

var tasks = {
  expand: {
    src: '**/*',
    cwd: 'test/cases/expand',
    dest: 'test/expected/expand'
  },

  // single file without any dependencies
  single: {
    src: '**/*.js',
    cwd: 'test/cases/single',
    dest: 'test/expected/single'
  },

  // single file with cmd id format
  cmdid: {
    options: {
      // you can read these from a package.json
      idleading: 'family/name/1.0.0/'
    },
    src: '*.js',
    cwd: 'test/cases/cmdid',
    dest: 'test/expected/cmdid'
  },

  // relative dependencies
  relative: {
    src: '**/*.js',
    cwd: 'test/cases/relative',
    dest: 'test/expected/relative'
  },

  // nested relative dependencies
  nested: {
    src: '**/*.js',
    cwd: 'test/cases/nested',
    dest: 'test/expected/nested'
  },

  // rely on other modules
  rely: {
    options: {
      paths: ['test/cases/assets']
    },
    src: '*.js',
    cwd: 'test/cases/rely-arale',
    dest: 'test/expected/rely-arale'
  },
  
  // reply on other modules (with alias)
  alias: {
    options: {
      paths: ['test/cases/assets'],
      alias: {
        'foo': 'arale/class/foo',
        '$': '$'
      }
    },
    src: '*.js',
    cwd: 'test/cases/alias',
    dest: 'test/expected/alias'
  },

  //parsing css
  css: {
    options: {
      alias: {
        'button': 'alice/button/1.0.0/button.css'
      }
    },
    src: '*.css',
    cwd: 'test/cases/css',
    dest: 'test/expected/css'
  },

  // parsing html into js
  text: {
    src: '*.html',
    cwd: 'test/cases/text',
    dest: 'test/expected/text'
  },

  tpl: {
    src: '*.tpl',
    cwd: 'test/cases/tpl',
    dest: 'test/expected/tpl'
  },

  css2js: {
    options: {
      parsers: {
        '.css': css2jsParser
      }
    },
    src: '*.css',
    cwd: 'test/cases/css2js',
    dest: 'test/expected/css2js'
  },

  style: {
    options: {
      parsers: {
        '.css': css2jsParser,
        '.js': jsParser
      },
      styleBox: ["a.css"],
      idleading: 'arale/widget/1.0.0/'
    },
    src: '*.{js,css}',
    cwd: 'test/cases/style',
    dest: 'test/expected/style'
  },

  duplicate: {
    src: '**/*.js',
    cwd: 'test/cases/duplicate',
    dest: 'test/expected/duplicate'
  },

  json: {
    src: '*.json',
    cwd: 'test/cases/json',
    dest: 'test/expected/json'
  },
  
  'id-deps-exist': {
    options: {
      paths: ['test/cases/assets'],
      alias: {
        'foo': 'arale/class/foo'
      }
    },
    src: '*.js',
    cwd: 'test/cases/id-deps-exist',
    dest: 'test/expected/id-deps-exist'
  },

  'text!': {
    src: '*.js',
    cwd: 'test/cases/text!',
    dest: 'test/expected/text!'
  },

  'directory': {
    src: '**/*.js',
    cwd: 'test/cases/directory',
    dest: 'test/expected/directory'
  }

};

var taskNames = Object.keys(tasks).map(function(name){
  var taskName = 'transport:' + name,
      task = tasks[name];

  gulp.task(taskName, function(){
    return gulp.src(task.src, { cwd: task.cwd })
      .pipe(transport(task.options || {}))
      .pipe(gulp.dest(task.dest));
  });

  return taskName;
});


gulp.task('clean', function(){
  return gulp.src('test/expected', { read: false })
    .pipe(clean());
});
gulp.task('transport', function(cb){
  runSeq('clean', taskNames, cb);
});
gulp.task('jshint', function(){
  return gulp.src(['gulpfile.js', 'lib/**/*.js', 'index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
gulp.task('mocha', function(){
  return gulp.src('test/transport.js')
    .pipe(mocha({
      reporter: 'list'
    }));
});

gulp.task('test', function(cb){
  runSeq('clean', taskNames, 'mocha', 'clean');
});
gulp.task('default', ['jshint']);