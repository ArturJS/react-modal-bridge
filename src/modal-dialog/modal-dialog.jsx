// @flow
import React, { memo, useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// eslint-disable-next-line import/no-cycle
import {
  MODAL_TYPES,
  Modal,
  modalService as defaultModalService
} from '../modal.service.jsx';
import { getClassNames } from '../utils';
import { BaseModal, CustomType, StandardType } from './components'; // eslint-disable-line import/no-cycle
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
    // eslint-disable-next-line no-underscore-dangle
    const cn = getClassNames(modalService._baseClassNames);
    const dismiss = (id: number) => {
      modalService.dismiss({ id });
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
    const renderDefaultModalFrame = modal => (
      <div className={cn.modalContent}>
        <button
          type="button"
          className={cn.close}
          onClick={() => dismiss(modal.id)}
        >
          &times;
        </button>
        <div className={cn.modalHeader}>
          <h3 className={cn.modalTitle}>{modal.title}</h3>
        </div>
        {modal.type === MODAL_TYPES.custom && (
          <CustomType cn={cn} modal={modal} modalService={modalService} />
        )}
        {modal.type !== MODAL_TYPES.custom && (
          <StandardType cn={cn} modal={modal} modalService={modalService} />
        )}
      </div>
    );

    return (
      <>
        {modals.map(modal => (
          <BaseModal
            key={modal.id}
            isOpen={modal.isOpen}
            onRequestClose={() => dismiss(modal.id)}
            style={modal.noBackdrop ? noBackdropStyle : defaultBackdropStyle}
            className={`${cn.modal} ${modal.className}`}
            shouldCloseOnOverlayClick={modal.shouldCloseOnOverlayClick}
            closeTimeoutMS={closeDelayMs}
            contentLabel=""
            ariaHideApp={false}
            parentSelector={getBaseModalMountRoot}
            disableInlineStyles={modalService._disableInlineStyles} // eslint-disable-line no-underscore-dangle
            cn={cn}
          >
            <TransitionGroup>
              {modal.isOpen && (
                <CSSTransition
                  key={modal.id}
                  appear
                  timeout={closeDelayMs}
                  classNames={cn.modalShow}
                  mountOnEnter
                  unmountOnExit
                >
                  {modal.component
                    ? modal.component({
                        closeModal: reason => {
                          modalService.close({
                            id: modal.id,
                            reason
                          });
                        },
                        dismissModal: reason => {
                          modalService.dismiss({
                            id: modal.id,
                            reason
                          });
                        }
                      })
                    : renderDefaultModalFrame(modal)}
                </CSSTransition>
              )}
            </TransitionGroup>
          </BaseModal>
        ))}
        {hasSpecificMountRoot && (
          <div className={cn.baseModalContainer} ref={baseModalMountRootRef} />
        )}
      </>
    );
  }
);
