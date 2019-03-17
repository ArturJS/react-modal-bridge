module.exports = {
  "Google's Search Functionality": browser => {
    browser
      .url('https://www.google.com/ncr')
      .waitForElementVisible('body', 1000)
      .setValue('input[type=text]', 'BrowserStack 01\n')
      .pause(1000)
      .assert.title('BrowserStack 01 - Google Search')
      .end();
  }
};
