const basePage = require('./_base');

const modalButtonCustom = `${basePage.elements.modalContent} button`;
const elements = {
  ...basePage.elements,
  modalButtonCustom
};

module.exports = {
  ...basePage,
  url() {
    return basePage.url.call(this, '/?path=/story/basic-usage--custom');
  },
  elements,
  commands: [
    {
      ...basePage.commands[0],
      elements
    }
  ]
};
