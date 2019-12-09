import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { ReactModalBridge, modal } from '../src';

storiesOf('Basic usage', module)
  .add('confirm', () => (
    <>
      <Button
        onClick={() => {
          modal
            .confirm({
              title: 'Are you sure?)',
              body: "It's nothing to fret over)))",
              throwCancelError: true
            })
            .result.then(action('close'))
            .catch(action('dismiss'));
        }}
      >
        Open confirm modal
      </Button>
      <ReactModalBridge />
    </>
  ))
  .add('info', () => (
    <>
      <p>Note: info modal by default do not have backdrop.</p>
      <Button
        onClick={() => {
          modal
            .info({
              title: 'Info ',
              body: 'Some useful information...'
            })
            .result.then(action('close'));
        }}
      >
        Open info modal
      </Button>
      <ReactModalBridge />
    </>
  ))
  .add('error', () => (
    <>
      <p>Note: error modal by default do not have backdrop.</p>
      <Button
        onClick={() => {
          modal
            .error({
              title: 'Oops... ',
              body: 'Something went wrong...',
              throwCancelError: true
            })
            .result.then(action('close'))
            .catch(action('dismiss'));
        }}
      >
        Open error modal
      </Button>
      <ReactModalBridge />
    </>
  ))
  .add('custom', () => (
    <>
      <p>
        Note: if you do not pass `throwCancelError` param, you will not get
        `.catch` triggered.
      </p>
      <Button
        onClick={() => {
          modal
            .custom({
              title: 'Custom modal content',
              // eslint-disable-next-line react/prop-types
              body: ({ closeModal }) => (
                <div>
                  <p>Here you can add any arbitary content.</p>
                  <Button
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Click to close custom modal
                  </Button>
                </div>
              )
            })
            .result.then(action('close'));
        }}
      >
        Open custom modal
      </Button>
      <ReactModalBridge />
    </>
  ));
