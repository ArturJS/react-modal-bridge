require('dotenv').config(); // load config from .env in dev environment

const nightwatchConfig = {
  src_folders: ['tests/local'],
  page_objects_path: ['pages'],
  test_runner: 'mocha',
  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  test_settings: {
    default: {
      globals: {
        waitForConditionTimeout: 5000
      },
      desiredCapabilities: {
        build: 'nightwatch-browserstack',
        'browserstack.user':
          process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
        'browserstack.key':
          process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
        'browserstack.debug': true,
        'browserstack.local': true,
        browser: 'chrome'
      },
      launch_url: process.env.LAUCH_URL
    }
  }
};

// Code to copy seleniumhost/port into test settings
/* eslint-disable no-param-reassign */
Object.values(nightwatchConfig.test_settings).forEach(config => {
  config.selenium_host = nightwatchConfig.selenium.host;
  config.selenium_port = nightwatchConfig.selenium.port;
});
/* eslint-enable no-param-reassign */

module.exports = nightwatchConfig;
