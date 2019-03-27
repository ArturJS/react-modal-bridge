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
      .openModalAndVerifyContent(modalContent)
      .closeModalAndVerifyIsClosed({
        closeVia: modalButtonOk
      });
  });

  it('should open and close modal by clicking [Cancel]', browser => {
    const confirmPage = browser.page.confirm();
    const { modalButtonCancel } = confirmPage.elements;

    confirmPage
      .openModalAndVerifyContent(modalContent)
      .closeModalAndVerifyIsClosed({
        closeVia: modalButtonCancel
      });
  });

  it('should open and close modal by clicking [X]', browser => {
    const confirmPage = browser.page.confirm();
    const { modalButtonClose } = confirmPage.elements;

    confirmPage
      .openModalAndVerifyContent(modalContent)
      .closeModalAndVerifyIsClosed({
        closeVia: modalButtonClose
      });
  });
});

// module.exports = {
//   beforeEach: browser => {
//     browser.page.confirm().navigate();
//   },

//   'should open and close modal by clicking [OK]': browser => {
//     const confirmPage = browser.page.confirm();
//     const { modalButtonOk } = confirmPage.elements;

//     confirmPage
//       .openModalAndVerifyContent(modalContent)
//       .closeModalAndVerifyIsClosed({
//         closeVia: modalButtonOk
//       });
//   },

//   'should open and close modal by clicking [Cancel]': browser => {
//     const confirmPage = browser.page.confirm();
//     const { modalButtonCancel } = confirmPage.elements;

//     confirmPage
//       .openModalAndVerifyContent(modalContent)
//       .closeModalAndVerifyIsClosed({
//         closeVia: modalButtonCancel
//       });
//   },

//   'should open and close modal by clicking [X]': browser => {
//     const confirmPage = browser.page.confirm();
//     const { modalButtonClose } = confirmPage.elements;

//     confirmPage
//       .openModalAndVerifyContent(modalContent)
//       .closeModalAndVerifyIsClosed({
//         closeVia: modalButtonClose
//       });
//   }
// };