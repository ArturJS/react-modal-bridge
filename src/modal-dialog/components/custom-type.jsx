// @flow
import React, { memo } from 'react';
import { Modal, ModalService } from '../../modal.service.jsx';
import { ModalBody } from './modal-body.jsx';

export const CustomType = memo(
  ({ modal, modalService }: {| modal: Modal, modalService: ModalService |}) => (
    <div className="rmb-modal-body">
      {<ModalBody modal={modal} modalService={modalService} />}
    </div>
  )
);
