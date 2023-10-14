import React, { memo } from 'react';
import { Modal, ModalService } from '../../modal.service'; // eslint-disable-line import/no-cycle

export const ModalBody = memo(
  ({ modal, modalService }: { modal: Modal; modalService: ModalService }) => (
    <>
      {typeof modal.body === 'string'
        ? modal.body
        : modal.body({
            // eslint-disable-next-line flowtype/no-weak-types
            closeModal: (reason?: unknown) => {
              modalService.close({
                id: modal.id,
                reason
              });
            },
            dismissModal: (reason?: unknown) => {
              modalService.dismiss({
                id: modal.id,
                reason
              });
            }
          })}
    </>
  )
);