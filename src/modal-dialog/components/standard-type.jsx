// @flow
import React, { memo } from 'react';
import { MODAL_TYPES, Modal, ModalService } from '../../modal.service.jsx';
import { ModalBody } from './modal-body.jsx';

export const StandardType = memo(
  ({
    cn,
    modal,
    modalService
  }: {|
    // eslint-disable-next-line flowtype/no-weak-types
    cn: Object,
    modal: Modal,
    modalService: ModalService
  |}) => {
    const close = (id: number) => {
      modalService.close({
        id
      });
    };
    const dismiss = (id: number) => {
      modalService.dismiss({
        id
      });
    };

    return (
      <div>
        <div className={cn.modalBody}>
          <ModalBody modal={modal} />
        </div>
        <div className={cn.modalFooter}>
          <button
            className={`${cn.btn} ${cn.btnPrimary} ${cn.btnOk}`}
            type="button"
            onClick={() => close(modal.id)}
          >
            {modal.okText}
          </button>
          {modal.type === MODAL_TYPES.confirm && (
            <button
              className={`${cn.btn} ${cn.btnDefault} ${cn.btnCancel}`}
              type="button"
              onClick={() => dismiss(modal.id)}
            >
              {modal.cancelText}
            </button>
          )}
        </div>
      </div>
    );
  }
);
