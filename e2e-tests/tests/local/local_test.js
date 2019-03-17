module.exports = {
  'BrowserStack Local Testing': browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 1000)
      .assert.containsText('body', 'Storybook')
      .end();
  }
};
