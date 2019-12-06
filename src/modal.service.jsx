// @flow

import type { Element } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import { sleep } from './utils';
import { createStore, Store } from './utils/store';
import { ModalDialog } from './modal-dialog';

export const MODAL_TYPES = {
  error: 'ERROR_MODAL',
  confirm: 'CONFIRM_MODAL',
  info: 'INFO_MODAL',
  custom: 'CUSTOM_MODAL'
};

let modalId = 0;
const generateId = () => {
  modalId += 1;

  return modalId;
};

// eslint-disable-next-line flowtype/no-weak-types
type TReason = mixed;

type TCloseFn = (reason?: TReason) => void;

type TDismissFn = (reason?: TReason) => void;

type TBodyFn = ({|
  // eslint-disable-next-line flowtype/no-weak-types
  closeModal?: (reason?: mixed) => void,
  // eslint-disable-next-line flowtype/no-weak-types
  dismissModal?: (reason?: mixed) => void
  // eslint-disable-next-line flowtype/no-weak-types
|}) => Element<any>;

type TBody = string | TBodyFn;

type TModalResult = {|
  result: Promise<TReason>,
  close: TCloseFn,
  dismiss: TDismissFn
|};

type TModalConfigBase = {|
  className?: string,
  throwCancelError?: boolean
|};

type TModalConfig =
  | {|
      title?: string,
      body: TBody,
      ...TModalConfigBase
    |}
  | {|
      component: TBodyFn,
      ...TModalConfigBase
    |};

type TModalType = $Values<typeof MODAL_TYPES>;

type TModalOpenConfig = {|
  ...TModalConfig,
  type: TModalType,
  noBackdrop?: boolean
|};

class CancelError extends Error {}

type TBaseClassNames = {|
  modalHeader?: string,
  modalTitle?: string,
  modalBody?: string,
  modalContent?: string,
  modalFooter?: string,
  modalShow?: string,
  btn?: string,
  btnPrimary?: string,
  btnDefault?: string,
  btnOk?: string,
  btnCancel?: string,
  close?: string,
  modal?: string,
  baseModalContainer?: string,
  overlay?: string,
  content?: string,
  portal?: string,
  bodyOpen?: string
|};

export class Modal {
  id: number;

  title: string;

  body: TBody;

  component: TBodyFn;

  type: TModalType;

  close: TCloseFn;

  dismiss: TDismissFn;

  className: string;

  shouldCloseOnOverlayClick: ?boolean;

  noBackdrop: boolean;

  isOpen: boolean;

  throwCancelError: boolean;

  constructor({
    id,
    title = '',
    body,
    component,
    type,
    close = () => {},
    dismiss = () => {},
    className = '',
    shouldCloseOnOverlayClick = true,
    noBackdrop = false,
    throwCancelError = false
  }: {|
    id: number,
    title: string,
    body: TBody,
    component: TBodyFn,
    type: TModalType,
    close: TCloseFn,
    dismiss: TDismissFn,
    className: string,
    shouldCloseOnOverlayClick?: boolean,
    noBackdrop: boolean,
    throwCancelError: boolean
  |}) {
    Object.assign(this, {
      id,
      title,
      body,
      component,
      type,
      close,
      dismiss,
      className,
      shouldCloseOnOverlayClick,
      noBackdrop,
      isOpen: true,
      throwCancelError
    });
  }
}

type TState = {|
  modals: Array<Modal>
|};

export class ModalService {
  _store: Store;

  _closeDelayMs: number;

  _mountRoot: string | HTMLElement | undefined;

  constructor({
    closeDelayMs,
    classNames,
    baseClassNames,
    mountRoot
  }: {|
    closeDelayMs?: number,
    classNames?: {|
      confirm?: string,
      info?: string,
      error?: string
    |},
    baseClassNames?: TBaseClassNames,
    mountRoot?: string | HTMLElement
  |} = {}) {
    // todo add runtime typecheck
    this._store = createStore({
      modals: []
    });
    // it's necessary to perform exit animation in modal-dialog.jsx
    this._closeDelayMs = closeDelayMs ?? 300;
    this._classNames = {
      confirm: 'rmb-modal-confirm',
      info: 'rmb-modal-info',
      error: 'rmb-modal-error',
      ...(classNames ?? {})
    };
    this._baseClassNames = baseClassNames ?? {};
    this._mountModalIfNeeded(mountRoot);
  }

  // eslint-disable-next-line class-methods-use-this
  create(config) {
    return new ModalService(config);
  }

  destroy(): void {
    ReactDOM.unmountComponentAtNode(this._mountRoot);
  }

  confirm({
    // prettier-ignore
    title,
    body,
    className = '',
    throwCancelError
  }: TModalConfig) {
    const { result, close } = this._performOpen({
      title,
      body,
      throwCancelError,
      type: MODAL_TYPES.confirm,
      className: `${this._classNames.confirm} ${className}`
    });

    return {
      result,
      close
    };
  }

  info({
    title,
    body,
    className = '',
    throwCancelError
  }: TModalConfig): TModalResult {
    const { result, close } = this._performOpen({
      title,
      body,
      throwCancelError,
      type: MODAL_TYPES.info,
      className: `${this._classNames.info} ${className}`,
      noBackdrop: true
    });

    return {
      result,
      close
    };
  }

  error({
    title,
    body,
    className = '',
    throwCancelError
  }: TModalConfig): TModalResult {
    const { result, close } = this._performOpen({
      title,
      body,
      throwCancelError,
      type: MODAL_TYPES.error,
      className: `${this._classNames.error} ${className}`,
      noBackdrop: true
    });

    return {
      result,
      close
    };
  }

  custom({
    title,
    body,
    component,
    className = '',
    throwCancelError
  }: TModalConfig): TModalResult {
    const { result, close } = this._performOpen({
      title,
      body,
      component,
      throwCancelError,
      type: MODAL_TYPES.custom,
      className
    });

    return {
      result,
      close
    };
  }

  subscribe(callback: (state: TState) => void): () => void {
    callback(this._store.getState());

    return this._store.subscribe(callback);
  }

  async closeAll(reason?: TReason) {
    await this._performCloseAll({ reason, isClose: true });
  }

  async dismissAll(reason?: TReason) {
    await this._performCloseAll({ reason, isClose: false });
  }

  async close({ id, reason }: { id: number, reason?: TReason }) {
    await this._performClose({ id, reason, isClose: true });
  }

  async dismiss({ id, reason }: { id: number, reason?: TReason }) {
    await this._performClose({ id, reason, isClose: false });
  }

  _mountModalIfNeeded(mountRoot: string | HTMLElement | undefined): void {
    this._mountRoot =
      typeof mountRoot === 'string'
        ? document.querySelector(mountRoot)
        : mountRoot;

    if (this._mountRoot) {
      ReactDOM.render(
        <ModalDialog
          hasSpecificMountRoot={!!this._mountRoot}
          modalService={this}
        />,
        this._mountRoot
      );
    }
  }

  _getCloseDelayMs() {
    return this._closeDelayMs;
  }

  _performOpen({
    title = '',
    body,
    component,
    type,
    className = '',
    throwCancelError = false,
    noBackdrop = false
  }: TModalOpenConfig): TModalResult {
    let close = () => {};
    let dismiss = () => {};
    const proxyResult = new Promise((resolve, reject) => {
      close = resolve;
      dismiss = reject;
    });
    const id = generateId();
    const newModal: Modal = new Modal({
      id,
      title,
      body,
      component,
      type,
      className,
      close,
      dismiss,
      noBackdrop,
      shouldCloseOnOverlayClick: true,
      throwCancelError
    });

    this._store.setState(({ modals }: { modals: Array<Modal> }) => ({
      modals: [...modals, newModal]
    }));

    const result = proxyResult
      .then((reason?: TReason) => {
        this.close({ id, reason });

        return reason;
      })
      .catch((reason?: TReason = new CancelError()) => {
        this.dismiss({ id, reason });

        throw reason;
      });

    return {
      result,
      close,
      dismiss
    };
  }

  async _performCloseAll({
    reason,
    isClose
  }: {
    reason?: TReason,
    isClose: boolean
  }) {
    const { modals }: { modals: Array<Modal> } = this._store.getState();

    modals.forEach(modal => {
      // eslint-disable-next-line no-param-reassign
      modal.isOpen = false;

      if (isClose) {
        modal.close(reason);
      } else {
        modal.dismiss(reason);
      }
    });

    await sleep(this._getCloseDelayMs());

    this._store.setState({ modals: [] });
  }

  async _performClose({
    id,
    reason,
    isClose
  }: {
    id: number,
    reason?: TReason,
    isClose: boolean
  }) {
    const { modals }: { modals: Array<Modal> } = this._store.getState();
    const modalToClose = modals.find(modal => modal.id === id);

    if (!modalToClose) {
      return;
    }

    modalToClose.isOpen = false;

    if (isClose) {
      modalToClose.close(reason);
    } else if (reason || modalToClose.throwCancelError) {
      modalToClose.dismiss(reason);
    }

    this._store.setState({
      // necessary to trigger update
      modals: [...modals]
    });

    await sleep(this._getCloseDelayMs());

    this._store.setState({
      modals: modals.filter(modal => modal.id !== id)
    });
  }
}

export const modalService = new ModalService();
