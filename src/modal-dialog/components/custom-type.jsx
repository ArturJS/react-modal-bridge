// @flow
import React, { memo } from 'react';
import { Modal } from '../../modal.service';
import { ModalBody } from './modal-body.jsx';

export const CustomType = memo(({ modal }: {| modal: Modal |}) => (
  <div className="rmb-modal-custom-body">{<ModalBody modal={modal} />}</div>
));
