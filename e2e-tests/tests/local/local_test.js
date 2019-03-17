module.exports = {
  'BrowserStack Local Testing': browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('body', 5000)
      .assert.containsText('body', 'Storybook')
      .end();
  }
};
