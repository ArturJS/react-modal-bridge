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
    const errorPage = browser.page.error();
    const { modalButtonOk } = errorPage.elements;
    browser.page.error().navigate();
    errorPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonOk
      })
      .verifyIsClosed();
  });

  it('should open and close modal by clicking [X]', browser => {
    const errorPage = browser.page.error();
    const { modalButtonClose } = errorPage.elements;

    errorPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonClose
      })
      .verifyIsClosed();
  });
});
