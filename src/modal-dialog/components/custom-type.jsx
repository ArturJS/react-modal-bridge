// @flow
import React, { memo } from 'react';
import { Modal, ModalService } from '../../modal.service.jsx';
import { ModalBody } from './modal-body.jsx';

export const CustomType = memo(
  ({
    cn,
    modal,
    modalService
  }: {|
    // eslint-disable-next-line flowtype/no-weak-types
    cn: Object,
    modal: Modal,
    modalService: ModalService
  |}) => (
    <div className={cn.ModalBody}>
      {<ModalBody modal={modal} modalService={modalService} />}
    </div>
  )
);
