const modalContent = {
  title: 'Oops...',
  body: 'Something went wrong...'
};

describe('Modal "error"', () => {
  beforeEach((browser, done) => {
    browser.page.error().navigate();
    done();
  });

  it('should open and close modal by clicking [OK]', browser => {
    const infoPage = browser.page.error();
    const { modalButtonOk } = infoPage.elements;
    browser.page.error().navigate();
    infoPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonOk
      })
      .verifyIsClosed();
  });

  it('should open and close modal by clicking [X]', browser => {
    const infoPage = browser.page.error();
    const { modalButtonClose } = infoPage.elements;

    infoPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonClose
      })
      .verifyIsClosed();
  });
});
