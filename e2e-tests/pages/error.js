const basePage = require('./_base');

module.exports = {
  ...basePage,
  url() {
    return basePage.url.call(this, '/?path=/story/basic-usage--error');
  }
};
