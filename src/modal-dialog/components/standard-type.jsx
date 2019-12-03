// @flow
import React, { memo } from 'react';
import { MODAL_TYPES, Modal, modalService } from '../../modal.service';
import { ModalBody } from './modal-body.jsx';

export const StandardType = memo(({ modal }: {| modal: Modal |}) => {
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
      <div className="rmb-modal-body">
        <ModalBody modal={modal} />
      </div>
      <div className="rmb-modal-footer">
        <button
          className="rmb-btn rmb-btn-primary rmb-btn-ok"
          type="button"
          onClick={() => close(modal.id)}
        >
          Ok
        </button>
        {modal.type === MODAL_TYPES.confirm && (
          <button
            className="rmb-btn rmb-btn-default rmb-btn-cancel"
            type="button"
            onClick={() => dismiss(modal.id)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
});
