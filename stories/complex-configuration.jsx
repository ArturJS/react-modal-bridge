import React, { useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { modal as modalService } from '../src';

const useModal = () => {
  const [modal, setModal] = useState();

  useEffect(() => {
    const modalInstance = modalService.create({
      mountRoot: '#modal-mount-root'
    });

    setModal(modalInstance);
  }, []);

  return modal;
};

storiesOf('Complex configuration', module)
  .add('modal factory confirm', () => {
    const ModalFactoryConfirmExample = () => {
      const modal = useModal();

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

    return <ModalFactoryConfirmExample />;
  })
  .add('modal factory custom', () => {
    const CustomModal = ({
      closeModal, // eslint-disable-line react/prop-types
      dismissModal // eslint-disable-line react/prop-types
    }) => (
      <div
        style={{
          maxWidth: '450px',
          margin: '0 auto',
          background:
            'linear-gradient(344deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)',
          borderRadius: '3px'
        }}
      >
        <iframe
          src="http://example.com/"
          title="example"
          style={{
            margin: '0 auto',
            display: 'block'
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button
            onClick={() => {
              closeModal('Reason 1');
            }}
          >
            Close with &quot;Reason 1&quot;
          </Button>
          <Button
            onClick={() => {
              dismissModal('Reason 2');
            }}
          >
            Dismiss with &quot;Reason 2&quot;
          </Button>
        </div>
      </div>
    );
    const ModalFactoryCustomExample = () => {
      const modal = useModal();

      return (
        <>
          <Button
            onClick={() => {
              modal
                .custom({
                  component: CustomModal,
                  throwCancelError: true
                })
                .result.then(action('close'))
                .catch(action('dismiss'));
            }}
          >
            Open custom modal
          </Button>
          <div id="modal-mount-root" />
        </>
      );
    };

    return <ModalFactoryCustomExample />;
  });
