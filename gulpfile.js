const gulp = require("gulp"),
  rimraf = require("gulp-rimraf"),
  sequence = require("gulp-sequence"),
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  rename = require("gulp-rename"),
  replace = require('gulp-replace'),
  tslint = require('gulp-tslint'),
  os = require('os'),
  exec = require('child_process').exec;

var typescriptError; // eslint-disable-line

gulp.task('imgs', () => gulp.src('app/theme/imgs/**/*').pipe(gulp.dest('bin/imgs')));
gulp.task('fonts', () => gulp.src('app/theme/fonts/**/*').pipe(rename({ dirname: '' })).pipe(gulp.dest('bin/fonts')));
gulp.task('svgs', () => gulp.src('app/theme/svgs/**/*').pipe(gulp.dest('bin/svgs')));
gulp.task('printer', () => gulp.src('app/printer/**/*').pipe(gulp.dest('bin/printer')));
gulp.task('assets', ['imgs', 'fonts', 'svgs', 'printer']);

gulp.task("sass", () =>
  gulp.src(["app/app.scss"])
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: "compressed"
  }).on("error", sass.logError))
  .pipe(sourcemaps.write("./maps"))
  .pipe(gulp.dest("bin"))
);

gulp.task("pug", () => {
  return gulp.src(["app/**/*.pug", "!app/**/_*.pug"])
    .pipe(pug({ pretty: false }))
    .pipe(replace('@VERSION', process.env.npm_package_version || 'NONE'))
    .pipe(gulp.dest("bin"));
});

gulp.task("clean", () => {
  return gulp.src(["bin/"], { read: false }).pipe(rimraf());
});

gulp.task("clean-dist", () => {
  return gulp.src(["dist/"], { read: false }).pipe(rimraf());
});

gulp.task('typescript-lint', () => {
  return gulp.src(`app/**/*.ts`)
    .pipe(tslint({ formatter: 'verbose' }))
    .pipe(tslint.report());
});

gulp.task('typescript', ['typescript-lint'], cb => {
  exec('node ./node_modules/typescript/bin/tsc', (err, stdout) => {
    console.log(stdout);
    if (err) throw err;
    cb();
  });
});

gulp.task('typescript-watch', cb => { // eslint-disable-line
  console.time('typescript');
  let firstTime = true,
    typescriptError = false;
  const data = exec('node ./node_modules/typescript/bin/tsc -w');

  data.stdout.on('data', data => {
    if (data.includes('error')) {
      typescriptError = true;
    }

    if (data.includes('Compilation complete')) {
      console.timeEnd('typescript');

      if (typescriptError) {
        typescriptError = false;
        return;
      }

      if (!firstTime && !typescriptError) {
        exec('npm run gulp typescript-lint').stdout.on('data', data => {
          console.log('lint: ' + data.replace(/^\n/g, ''));
        });
      }

      firstTime = false;
    }

    if (data.includes('File change detected')) {
      console.time('typescript');
    }

    console.log('typescript: ' + data);
  });

  data.stderr.on('data', data => console.error(data));
});

gulp.task("package", () => {
  return gulp.src('package.json')
    .pipe(gulp.dest('bin'));
});

gulp.task("compile", cb => {
  sequence(["clean", "clean-dist"], ["pug", "typescript", "sass", "package", "assets"], () => cb());
});

gulp.task("watch", ["compile"], cb => {
  gulp.watch("app/**/*.scss", ["sass"]);
  gulp.watch("app/**/*.pug", ["pug"]);

  exec('npm run gulp typescript-watch').stdout.on('data', data => {
    if (
      /^\[\d{2}:\d{2}:\d{2}\]$\s{0,}/g.test(data) ||
      /^lint: \[\d{2}:\d{2}:\d{2}\]\s{0,}$/g.test(data) ||
      data.includes('Using gulpfile') ||
      data.startsWith('>') ||
      data.startsWith('lint: >') ||
      data.startsWith('lint: ERROR:')
    ) return;

    if (data.includes('Compilation complete')) {
      cb && cb();
      cb = null;
    }

    if (data.includes('Finished \'typescript-lint\'')) {
      console.log(data.replace(/\n/g, ''));
      console.log('\n');
      return;
    }

    if (data.includes('File change detected')) {
      console.log('\n\n\n***************************************************************************');
    }

    if (data.includes('lint: ')) {
      return console.log(data.replace(/\n\n/g, '').replace(/\n$/g, ''));
    }

    console.log(data.replace(/\n/g, ''));
  });

  exec(`npm run ${os.platform() === 'linux' ? 'electron': 'electron-win' }`, (error, stdout) => {
    if (error) { throw error; }
    console.log(stdout);
  }).stdout.on('data', function(data) {
    console.log(`electron: ${data.toString().replace(/$\n/, '').replace(/\n$/, '').replace(/\n\n/, '')}`);
  });
});

gulp.task("default", ["watch"]);
