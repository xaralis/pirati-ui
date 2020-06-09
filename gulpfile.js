/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
 ******************************************************/
var gulp = require("gulp"),
  path = require("path"),
  browserSync = require("browser-sync").create(),
  argv = require("minimist")(process.argv.slice(2));

const postcss = require("gulp-postcss");
const tailwindcss = require("tailwindcss");
const rename = require("gulp-rename");
const assets = require("postcss-assets");
const postcssPurgecss = require("@fullhuman/postcss-purgecss")({
  content: [
    "./source/**/*.mustache",
    "./source/**/*.json",
    "./source/**/*.js",
    "./public/**/*.html",
    "./public/**/*.js",
  ],
  defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

function resolvePath(pathInput) {
  return path.resolve(pathInput).replace(/\\/g, "/");
}

/******************************************************
 * COPY TASKS - stream assets from source to destination
 ******************************************************/
// JS copy
gulp.task("pl-copy:js", function (done) {
  return gulp
    .src("**/*.js", { cwd: resolvePath(paths().source.js) })
    .pipe(gulp.dest(resolvePath(paths().public.js)))
    .on("end", done);
});

// Images copy
gulp.task("pl-copy:img", function (done) {
  return gulp
    .src("**/*.*", { cwd: resolvePath(paths().source.images) })
    .pipe(gulp.dest(resolvePath(paths().public.images)))
    .on("end", done);
});

// Favicon copy
gulp.task("pl-copy:favicon", function (done) {
  return gulp
    .src("favicon.ico", { cwd: resolvePath(paths().source.root) })
    .pipe(gulp.dest(resolvePath(paths().public.root)))
    .on("end", done);
});

// Fonts copy
gulp.task("pl-copy:font", function (done) {
  return gulp
    .src("*", { cwd: resolvePath(paths().source.fonts) })
    .pipe(gulp.dest(resolvePath(paths().public.fonts)))
    .on("end", done);
});

// CSS Copy
// only copy style.pkgd.css and patternlab-scaffolding.css
gulp.task("pl-copy:css", function (done) {
  return gulp
    .src(resolvePath(paths().source.root) + "/dist/style.pkgd.css")
    .pipe(
      gulp.src(resolvePath(paths().source.css) + "/pattern-scaffolding.css")
    )
    .pipe(gulp.dest(resolvePath(paths().public.css)))
    .pipe(browserSync.stream())
    .on("end", done);
});

// Styleguide Copy everything but css
gulp.task("pl-copy:styleguide", function (done) {
  return gulp
    .src(resolvePath(paths().source.styleguide) + "/**/!(*.css)")
    .pipe(gulp.dest(resolvePath(paths().public.root)))
    .pipe(browserSync.stream())
    .on("end", done);
});

// Styleguide Copy and flatten css
gulp.task("pl-copy:styleguide-css", function (done) {
  return gulp
    .src(resolvePath(paths().source.styleguide) + "/**/*.css")
    .pipe(
      gulp.dest(function (file) {
        //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
        file.path = path.join(file.base, path.basename(file.path));
        return resolvePath(path.join(paths().public.styleguide, "/css"));
      })
    )
    .pipe(browserSync.stream())
    .on("end", done);
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
 ******************************************************/
//read all paths from our namespaced config file
var config = require("./patternlab-config.json"),
  patternlab = require("patternlab-node")(config);

function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  console.log("Building Pattern Lab ...");
  patternlab.build(done, getConfiguredCleanOption());
}

gulp.task(
  "pl-assets",
  gulp.parallel(
    "pl-copy:js",
    "pl-copy:img",
    "pl-copy:favicon",
    "pl-copy:font",
    "pl-copy:css",
    "pl-copy:styleguide",
    "pl-copy:styleguide-css"
  )
);

gulp.task("patternlab:version", function (done) {
  patternlab.version();
  done();
});

gulp.task("patternlab:help", function (done) {
  patternlab.help();
  done();
});

gulp.task("patternlab:patternsonly", function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task("patternlab:liststarterkits", function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task("patternlab:loadstarterkit", function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task(
  "patternlab:build",
  gulp.series("pl-assets", build)
);

gulp.task("patternlab:installplugin", function (done) {
  patternlab.installplugin(argv.plugin);
  done();
});

/******************************************************
 * SERVER AND WATCH TASKS
 ******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require("./node_modules/patternlab-node/core/lib/pattern_engines");
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return resolvePath(paths().source.patterns) + "/**/*" + dotExtension;
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function reloadCSS(done) {
  browserSync.reload("*.css");
  done();
}

function reloadJS(done) {
  browserSync.reload("*.js");
  done();
}

/******************************************************
 * TAILWIND AND POSTCSS TASKS
 ******************************************************/

gulp.task("tailwind-postcss", function (done) {
  return gulp
    .src("./source/css/style.css")
    .pipe(
      postcss([
        require("postcss-import"),
        tailwindcss("./tailwind.config.js"),
        require("postcss-nested"),
        // require('postcss-preset-env'),
        require("postcss-custom-properties"),
        require("autoprefixer"),
        assets({
          basePath: "source/",
          loadPaths: ["images/"],
        }),
        require("postcss-clean"),
      ])
    )
    .pipe(rename("style.pkgd.css"))
    .pipe(gulp.dest("./source/dist"))
    .on("end", done);
});

gulp.task("tailwind-postcss:production", function (done) {
  return gulp
    .src("./source/css/style.css")
    .pipe(
      postcss([
        require("postcss-import"),
        tailwindcss("./tailwind.config.js"),
        require("postcss-nested"),
        // require('postcss-preset-env'),
        require("postcss-custom-properties"),
        require("autoprefixer"),
        assets({
          basePath: "source/",
          loadPaths: ["images/"],
        }),
        require("postcss-clean"),
        postcssPurgecss,
      ])
    )
    .pipe(rename("style.pkgd.css"))
    .pipe(gulp.dest("./source/dist"))
    .on("end", done);
});

gulp.task(
  "tailwind-postcss:build",
  gulp.series("tailwind-postcss", "patternlab:build")
);

gulp.task(
  "tailwind-postcss:build:production",
  gulp.series("tailwind-postcss:production", "patternlab:build")
);

function rebuild(done) {
  return gulp.series(build, reload, () => done());
}

function watch() {
  const jsPaths = [
    resolvePath(paths().source.js) + "/*.js",
    resolvePath(paths().source.js) + "/**/*.js",
  ];
  const postcssPaths = [
    resolvePath(paths().source.css) + "/*.pcss",
    resolvePath(paths().source.css) + "/**/*.pcss",
  ];

  // Detect JS changes
  gulp.watch(
    jsPaths,
    gulp.series("pl-copy:js", reloadJS)
  );

  // Detect postcss file changes
  gulp.watch(
    postcssPaths,
    gulp.series("tailwind-postcss")
  );

  console.log("Watching following source files:", jsPaths.concat(postcssPaths));

  // Detect updated css bundle change
  gulp.watch(
    resolvePath(paths().source.root) + "/dist/style.pkgd.css",
    gulp.series("pl-copy:css", reloadCSS)
  );

  // Detect changes in styleguide assets down in node_modules
  gulp.watch(
    [
      resolvePath(paths().source.styleguide) + "/*.*",
      resolvePath(paths().source.styleguide) + "/**/*.*",
    ],
    gulp.series("pl-copy:styleguide", "pl-copy:styleguide-css", reloadCSS)
  );

  var patternWatches = [
    resolvePath(paths().source.patterns) + "/**/*.json",
    resolvePath(paths().source.patterns) + "/**/*.md",
    resolvePath(paths().source.data) + "/**/*.json",
    resolvePath(paths().source.fonts) + "/**/*",
    resolvePath(paths().source.images) + "/**/*",
    resolvePath(paths().source.meta) + "/**/*",
    resolvePath(paths().source.annotations) + "/**/*",
  ].concat(getTemplateWatches());

  console.log("Watching following Pattern Lab files:", patternWatches);

  gulp.watch(patternWatches, gulp.series(build, reload));
}

gulp.task(
  "patternlab:connect",
  function (done) {
    browserSync.init(
      {
        server: {
          baseDir: resolvePath(paths().public.root),
        },
        snippetOptions: {
          // Ignore all HTML files within the templates folder
          blacklist: ["/index.html", "/", "/?*"],
        },
        notify: {
          styles: [
            "display: none",
            "padding: 15px",
            "font-family: sans-serif",
            "position: fixed",
            "font-size: 1em",
            "z-index: 9999",
            "bottom: 0px",
            "right: 0px",
            "border-top-left-radius: 5px",
            "background-color: #1B2032",
            "opacity: 0.4",
            "margin: 0",
            "color: white",
            "text-align: center",
          ],
        },
      },
      done
    );
  }
);

/******************************************************
 * COMPOUND TASKS
 ******************************************************/
gulp.task("default", gulp.series("tailwind-postcss:build:production"));
gulp.task("patternlab:watch", gulp.series("tailwind-postcss:build", watch));
gulp.task(
  "patternlab:serve",
  gulp.series("tailwind-postcss:build", "patternlab:connect", watch)
);
