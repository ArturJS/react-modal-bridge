const nightwatchConfig = {
  src_folders: ['tests/local'],

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80
  },

  common_capabilities: {
    build: 'nightwatch-browserstack',
    'browserstack.user':
      process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    'browserstack.key':
      process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
    'browserstack.debug': true,
    'browserstack.local': true
  },

  test_settings: {
    default: {},
    chrome: {
      desiredCapabilities: {
        browser: 'chrome'
      }
    },
    firefox: {
      desiredCapabilities: {
        browser: 'firefox'
      }
    },
    safari: {
      desiredCapabilities: {
        browser: 'safari'
      }
    }
  }
};

// Code to support common capabilites
/* eslint-disable no-param-reassign */
Object.values(nightwatchConfig.test_settings).forEach(config => {
  config.selenium_host = nightwatchConfig.selenium.host;
  config.selenium_port = nightwatchConfig.selenium.port;
  config.desiredCapabilities = config.desiredCapabilities || {};

  Object.keys(nightwatchConfig.common_capabilities).forEach(key => {
    config.desiredCapabilities[key] =
      config.desiredCapabilities[key] ||
      nightwatchConfig.common_capabilities[key];
  });
});
/* eslint-enable no-param-reassign */

module.exports = nightwatchConfig;
