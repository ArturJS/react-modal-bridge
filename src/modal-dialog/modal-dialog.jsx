// @flow
import React, { memo, useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import BaseModal from './components/base-modal';
import {
  MODAL_TYPES,
  Modal,
  modalService as defaultModalService
} from '../modal.service.jsx';
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

const useModalsSubscription = modalService => {
  const [modals, setModals] = useState([]);

  useEffect(() => {
    const unsubscribe = modalService.subscribe(
      // eslint-disable-next-line no-shadow
      ({ modals }: {| modals: Array<Modal> |}) => {
        setModals(modals);
      }
    );

    return unsubscribe;
  }, [modalService]);

  return modals;
};

export const ModalDialog = memo(
  // eslint-disable-next-line react/prop-types
  ({ hasSpecificMountRoot, modalService = defaultModalService }) => {
    const dismiss = (id: number) => {
      modalService.dismiss({
        id
      });
    };
    // eslint-disable-next-line no-underscore-dangle
    const closeDelayMs = modalService._getCloseDelayMs();
    const modals = useModalsSubscription(modalService);
    const baseModalMountRootRef = useRef();
    const getBaseModalMountRoot = () => {
      if (hasSpecificMountRoot) {
        return baseModalMountRootRef.current;
      }

      return document.body;
    };

    return (
      <>
        {modals.map(modal => (
          <BaseModal
            key={modal.id}
            isOpen={modal.isOpen}
            onRequestClose={() => dismiss(modal.id)}
            style={modal.noBackdrop ? noBackdropStyle : defaultBackdropStyle}
            className={`rmb-modal ${modal.className}`}
            shouldCloseOnOverlayClick={modal.shouldCloseOnOverlayClick}
            closeTimeoutMS={closeDelayMs}
            contentLabel=""
            ariaHideApp={false}
            parentSelector={getBaseModalMountRoot}
          >
            <TransitionGroup>
              {modal.isOpen && (
                <CSSTransition
                  key={modal.id}
                  appear
                  timeout={closeDelayMs}
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
          </BaseModal>
        ))}
        {hasSpecificMountRoot && (
          <div
            className="rmb-base-modal-container"
            ref={baseModalMountRootRef}
          />
        )}
      </>
    );
  }
);
