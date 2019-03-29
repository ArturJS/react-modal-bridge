const modalContent = {
  title: 'Custom modal content',
  body: 'Here you can add any arbitary content.'
};

describe('Modal "custom"', () => {
  beforeEach((browser, done) => {
    browser.page.custom().navigate();
    done();
  });

  it('should open and close modal by clicking custom button', browser => {
    const customPage = browser.page.custom();
    const { modalButtonCustom } = customPage.elements;

    browser.page.custom().navigate();
    customPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonCustom
      })
      .verifyIsClosed();
  });

  it('should open and close modal by clicking [X]', browser => {
    const customPage = browser.page.custom();
    const { modalButtonClose } = customPage.elements;

    customPage
      .openModal()
      .verifyContent(modalContent)
      .closeModal({
        closeVia: modalButtonClose
      })
      .verifyIsClosed();
  });
});
