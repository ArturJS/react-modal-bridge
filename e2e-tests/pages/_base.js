// by some reason
// native nightwatch `elements` do not work within iframe
const openButton = 'button';
const modalContent = '.rmb-modal-content';
const modalTitle = '.rmb-modal-title';
const modalBody = '.rmb-modal-body';
const modalButtonOk = '.rmb-btn-ok';
const modalButtonCancel = '.rmb-btn-cancel';
const modalButtonClose = '.rmb-close';

const elements = {
  modalContent,
  modalButtonOk,
  modalButtonCancel,
  modalButtonClose
};

module.exports = {
  url(path) {
    return `${this.api.launchUrl}${path}`;
  },
  elements,
  commands: [
    {
      openModal() {
        this.api
          .frame(0)
          .waitForElementVisible(openButton)
          .click(openButton)
          .pause(1000);

        return this;
      },
      verifyContent({ title, body }) {
        this.api
          .waitForElementVisible(modalContent)
          .assert.containsText(modalTitle, title)
          .assert.containsText(modalBody, body);

        return this;
      },
      closeModal({ closeVia }) {
        this.api.click(closeVia);

        return this;
      },
      verifyIsClosed() {
        this.api.expect.element(modalContent).not.to.be.present.after(5000);

        return this;
      },
      elements
    }
  ]
};
