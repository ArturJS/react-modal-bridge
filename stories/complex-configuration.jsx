import React, { useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { modal as modalService } from '../src';

const ModalFactoryExample = () => {
  let modal;

  useEffect(() => {
    modal = modalService.create({
      mountRoot: '#modal-mount-root'
    });

    return () => {
      modal.destroy();
    };
  }, []);

  return (
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
      <div id="modal-mount-root" />
    </>
  );
};

storiesOf('Complex configuration', module).add('modal factory', () => (
  <ModalFactoryExample />
));
