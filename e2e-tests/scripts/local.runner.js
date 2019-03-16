#!/usr/bin/env node

/* eslint-disable import/no-unresolved */
const Nightwatch = require('nightwatch');
const browserstack = require('browserstack-local');
/* eslint-enable import/no-unresolved */

let bsLocal;

try {
  process.mainModule.filename = './node_modules/nightwatch/bin/nightwatch';
  // Code to start browserstack local before start of test
  console.log('Connecting local'); // eslint-disable-line no-console
  bsLocal = new browserstack.Local();
  Nightwatch.bs_local = bsLocal;

  bsLocal.start({ key: process.env.BROWSERSTACK_ACCESS_KEY }, error => {
    if (error) throw error;

    console.log('Connected. Now testing...'); // eslint-disable-line no-console
    Nightwatch.cli(argv => {
      Nightwatch.CliRunner(argv)
        .setup(null, () => {
          // Code to stop browserstack local after end of parallel test
          bsLocal.stop(() => {});
        })
        .runTests(() => {
          // Code to stop browserstack local after end of single test
          bsLocal.stop(() => {});
        });
    });
  });
} catch (ex) {
  // eslint-disable-next-line no-console
  console.log('There was an error while starting the test runner:\n\n');
  process.stderr.write(`${ex.stack}\n`);
  process.exit(2);
}
