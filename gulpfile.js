var gulp = require('gulp'),
    clean = require('gulp-clean'),
    runSeq = require('run-sequence'),
    transport = require('./');

var tasks = {
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

  // parsing html into js
  text: {
    src: '*.html',
    cwd: 'test/cases/text',
    dest: 'test/expected/text'
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

gulp.task('default', ['transport']);