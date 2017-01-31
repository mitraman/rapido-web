// Karma configuration
// Generated on Mon Jan 16 2017 10:40:31 GMT+0000 (STD)

var path = require("path");

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './spec/**/*spec.js*'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './spec/**/*spec.js*': ['webpack']
    },

    webpack: {
      module: {
          loaders: [
              {
                  //tell webpack to use jsx-loader for all *.jsx files
                  test: /\.jsx$/,
                  exclude: /node_modules/,
                  loader: 'babel-loader?presets[]=es2015&presets[]=react'
              },
              {
                  //tell webpack to use jsx-loader for all *.jsx files
                  test: /\.js$/,
                  exclude: /node_modules/,
                  loader: 'babel-loader?presets[]=es2015'
              },
              {
                test: /\.css$/,
                loader: "style-loader!css-loader"
              }
            ]
      },
      resolve: {
          extensions: ['', '.js', '.jsx']
      },
      resolve: {
          root: [
            path.resolve('./src'),
            path.resolve('./node_modules')
          ],
          extensions: ['', '.js', '.jsx']
      },
      externals: {
        cheerio: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      devtool: "cheap-eval-source-map"
    },



    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
