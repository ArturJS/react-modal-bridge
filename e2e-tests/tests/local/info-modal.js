const modalContent = {
  title: 'Info',
  body: 'Some useful information...'
};

describe('Modal "info"', () => {
  beforeEach((browser, done) => {
    browser.page.info().navigate();
    done();
  });

  after((browser, done) => {
    // it's temporary solution
    // for closing browser after all tests
    // by some reason globals.js doesn't work with `after`
    // for performing browser.end()
    // when using mocha
    browser.end();
    done();
  });

  it('should open and close modal by clicking [OK]', browser => {
    const infoPage = browser.page.info();
    const { modalButtonOk } = infoPage.elements;
    browser.page.info().navigate();
    infoPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonOk
      })
      .verifyIsClosed();
  });

  it('should open and close modal by clicking [X]', browser => {
    const infoPage = browser.page.info();
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
