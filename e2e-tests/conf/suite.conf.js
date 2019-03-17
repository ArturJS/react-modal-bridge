const nightwatchConfig = {
  src_folders: ['tests/suite'],

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        build: 'nightwatch-browserstack',
        'browserstack.user':
          process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
        'browserstack.key':
          process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
        'browserstack.debug': true,
        browser: 'chrome'
      }
    }
  },

  test_workers: {
    enabled: true,
    workers: 10
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
