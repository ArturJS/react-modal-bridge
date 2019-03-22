// @flow
import React, { memo } from 'react';
import { Modal, modalService } from '../../modal.service';

export const ModalBody = memo(({ modal }: {| modal: Modal |}) => (
  <>
    {typeof modal.body === 'string'
      ? modal.body
      : modal.body({
          // eslint-disable-next-line flowtype/no-weak-types
          closeModal: (reason?: mixed) => {
            modalService.close({
              id: modal.id,
              reason
            });
          }
        })}
  </>
));
