// by some reason
// native nightwatch `elements` do not work withing iframe
const openButton = 'button';
const modalContent = '.rmb-modal-content';
const modalTitle = '.rmb-modal-title';
const modalBody = '.rmb-modal-body';
const modalButtonOk = '.rmb-btn-ok';
const modalButtonCancel = '.rmb-btn-cancel';
const modalButtonClose = '.rmb-close';

module.exports = {
  url() {
    return this.api.launchUrl;
  },
  elements: {},
  commands: [
    {
      openModalAndVerifyContent({ title, body }) {
        this.api
          .frame(0)
          .waitForElementVisible(openButton)
          .click(openButton)
          .pause(1000)
          .waitForElementVisible(modalContent)
          .assert.containsText(modalTitle, title)
          .assert.containsText(modalBody, body);

        return this;
      },
      closeModalAndVerifyIsClosed({ closeVia }) {
        this.api
          .click(closeVia)
          .expect.element(modalContent)
          .not.to.be.present.after(1000);

        return this;
      },
      elements: {
        modalButtonOk,
        modalButtonCancel,
        modalButtonClose
      }
    }
  ]
};
