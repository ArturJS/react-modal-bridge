# react-modal-bridge

The bridge between lawless react-modal and strict opinionated modal API

[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=MEtqdFRZR3JsSkFtbjk3czFBa1l6M2prdDMzbzFEVUlFUUlhZEdReXp5ST0tLXFvOVU4anpjZWNvMkhmL3lyb2lNRmc9PQ==--aefafd6a79ec8c5a06b4bc0e7b42c88400d400f4)](https://www.browserstack.com/automate/public-build/MEtqdFRZR3JsSkFtbjk3czFBa1l6M2prdDMzbzFEVUlFUUlhZEdReXp5ST0tLXFvOVU4anpjZWNvMkhmL3lyb2lNRmc9PQ==--aefafd6a79ec8c5a06b4bc0e7b42c88400d400f4)

The main purpose of this package is to create strict API around [react-modal](https://github.com/reactjs/react-modal) to use it in react based apps.

## Requirements

Make sure you have at least 16.8.0 version of react and react-dom.

Otherwise if your react version is ^15.3.0 you can upgrade it with help of [react-codemods](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles).

## Example

```
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactModalBridge, modal } from 'react-modal-bridge';
import 'react-modal-bridge/dist/react-modal-bridge.css';

const App = () => {
    const openModal = () => {
        modal
            .confirm({
              title: 'Confirmation title',
              body: 'some content...',
              throwCancelError: true // will reject result if it's dismissed
            })
            .result
            .then(() => {
                console.log('Closed');
            })
            .catch(() => {
                console.log('Dismissed');
            });
    };

    return (
        <>
            <button type="button" onClick={openModal}>
                Open confirmation
            </button>
            <ReactModalBridge />
        </>
    )
};

const appRootElement = document.createElement('div');

ReactDOM.render(<App/>, appRootElement);

document.body.appendChild(appRootElement);

```

## TODO:

- [x] Setup CI/CD pipelines with help of TravisCI and now.sh
- [ ] Add more examples with type definitions (codesandbox.io)
- [ ] Add typings for TypeScript users
- [ ] Add more E2E tests
- [ ] Fix unit tests when Enzyme will support react-hooks
- [ ] Add Changelog.md
- [ ] Get rid of react-modal in favour of custom solution (renderless modal)
- [ ] Add git tags with auto publish to npm registry
