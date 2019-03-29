const modalContent = {
  title: 'Are you sure?)',
  body: "It's nothing to fret over)))"
};

describe('Modal "confirm"', () => {
  beforeEach((browser, done) => {
    browser.page.confirm().navigate();
    done();
  });

  it('should open and close modal by clicking [OK]', browser => {
    const confirmPage = browser.page.confirm();
    const { modalButtonOk } = confirmPage.elements;

    confirmPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonOk
      })
      .verifyIsClosed();
  });

  it('should open and close modal by clicking [Cancel]', browser => {
    const confirmPage = browser.page.confirm();
    const { modalButtonCancel } = confirmPage.elements;

    confirmPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonCancel
      })
      .verifyIsClosed();
  });

  it('should open and close modal by clicking [X]', browser => {
    const confirmPage = browser.page.confirm();
    const { modalButtonClose } = confirmPage.elements;

    confirmPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonClose
      })
      .verifyIsClosed();
  });
});
