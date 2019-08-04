// @flow
import React, { memo, useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  MODAL_TYPES,
  CLOSE_DELAY_MS,
  Modal,
  modalService
} from '../modal.service';
import { CustomType, StandardType } from './components';
import './styles';

const defaultBackdropStyle = {
  overlay: {
    backgroundColor: ''
  }
};

const noBackdropStyle = {
  overlay: {
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    zIndex: 1080
  }
};

const useModalsSubscription = () => {
  const [modals, setModals] = useState([]);

  useEffect(() => {
    const unsubscribe = modalService.subscribe(
      // eslint-disable-next-line no-shadow
      ({ modals }: {| modals: Array<Modal> |}) => {
        setModals(modals);
      }
    );

    return unsubscribe;
  }, []);

  return modals;
};

export const ModalDialog = memo(() => {
  const dismiss = (id: number) => {
    modalService.dismiss({
      id
    });
  };

  const modals = useModalsSubscription();

  return (
    <>
      {modals.map(modal => (
        <ReactModal
          key={modal.id}
          isOpen={modal.isOpen}
          onRequestClose={() => dismiss(modal.id)}
          style={modal.noBackdrop ? noBackdropStyle : defaultBackdropStyle}
          className={`rmb-modal ${modal.className}`}
          shouldCloseOnOverlayClick={modal.shouldCloseOnOverlayClick}
          closeTimeoutMS={CLOSE_DELAY_MS}
          contentLabel=""
          ariaHideApp={false}
        >
          <TransitionGroup>
            {modal.isOpen && (
              <CSSTransition
                key={modal.id}
                appear
                timeout={CLOSE_DELAY_MS}
                classNames="rmb-modal-show"
                mountOnEnter
                unmountOnExit
              >
                <div className="rmb-modal-content">
                  <button
                    type="button"
                    className="rmb-close"
                    onClick={() => dismiss(modal.id)}
                  >
                    &times;
                  </button>
                  <div className="rmb-modal-header">
                    <h3 className="rmb-modal-title">{modal.title}</h3>
                  </div>
                  {modal.type === MODAL_TYPES.custom && (
                    <CustomType modal={modal} />
                  )}
                  {modal.type !== MODAL_TYPES.custom && (
                    <StandardType modal={modal} />
                  )}
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </ReactModal>
      ))}
    </>
  );
});
