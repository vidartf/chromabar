module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['mocha', 'karma-typescript'],
    reporters: ['mocha', 'karma-typescript'],
    client: {
      mocha: {
        timeout : 10000, // 10 seconds - upped from 2 seconds
        retries: 3 // Allow for slow server on CI.
      }
    },
    files: [
      { pattern: "tests/src/**/*.ts" },
      { pattern: "src/**/*.ts" }
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    browserNoActivityTimeout: 31000, // 31 seconds - upped from 10 seconds
    port: 9876,
    colors: true,
    singleRun: !config.debug,
    logLevel: config.LOG_INFO,

    customLaunchers: {
      ChromeCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },


    karmaTypescriptConfig: {
      tsconfig: 'tests/src/tsconfig.json',
      bundlerOptions: {
        sourceMap: true
      },
      coverageOptions: {
        instrumentation: !config.debug
      },
      reports: {
        "text-summary": "",
        "html": "coverage",
        "lcovonly": {
          "directory": "coverage",
          "filename": "coverage.lcov"
        }
      }
    }
  });
};
