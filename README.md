# react-modal-bridge

The bridge between lawless react-modal and strict opinionated modal API

[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=MEtqdFRZR3JsSkFtbjk3czFBa1l6M2prdDMzbzFEVUlFUUlhZEdReXp5ST0tLXFvOVU4anpjZWNvMkhmL3lyb2lNRmc9PQ==--aefafd6a79ec8c5a06b4bc0e7b42c88400d400f4)](https://www.browserstack.com/automate/public-build/MEtqdFRZR3JsSkFtbjk3czFBa1l6M2prdDMzbzFEVUlFUUlhZEdReXp5ST0tLXFvOVU4anpjZWNvMkhmL3lyb2lNRmc9PQ==--aefafd6a79ec8c5a06b4bc0e7b42c88400d400f4)

The main purpose of this package is to create strict API around [react-modal](https://github.com/reactjs/react-modal) to use it in react based apps.

## Requirements

Make sure you have at least 16.8.0 version of react and react-dom.

Otherwise if your react version is ^15.3.0 you can upgrade it with help of [react-codemods](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles).

## Interactive examples

- [Confirm modal](https://codesandbox.io/s/3x6v27vo41)

- [Info modal](https://codesandbox.io/s/88511rmov9)

- [Error modal](https://codesandbox.io/s/pkp753632j)

- [Custom modal](https://codesandbox.io/s/6wp93mwvrk)

## TODO:

- [x] Setup CI/CD pipelines with help of TravisCI and now.sh
- [x] Add examples with codesandbox.io
- [ ] Add typings for TypeScript users
- [ ] Add more E2E tests
- [ ] Fix unit tests when Enzyme will support react-hooks
- [ ] Add Changelog.md
- [ ] Get rid of react-modal in favour of custom solution (renderless modal)
- [ ] Add git tags with auto publish to npm registry
