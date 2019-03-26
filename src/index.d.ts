import { MemoExoticComponent, Element } from 'react';

type TReason = any;

type TCloseFn = (reason?: TReason) => void;

type TCustomRenderFn = ({ closeModal: TCloseFn }) => Element;

type TBody = string | TCustomRenderFn;

type TModalResult = {
  result: Promise<TReason>;
  close: TCloseFn;
};

type TModalConfig = {
  title?: string;
  body: TBody;
  className?: string;
  throwCancelError?: boolean;
};

type TModal = (config: TModalConfig) => TModalResult;

type TModalType =
  | 'ERROR_MODAL'
  | 'CONFIRM_MODAL'
  | 'INFO_MODAL'
  | 'CUSTOM_MODAL';

class Modal {
  id: number;

  title: string;

  body: TBody;

  type: TModalType;

  close: TCloseFn;

  dismiss: TCloseFn;

  className: string;

  shouldCloseOnOverlayClick: boolean;

  noBackdrop: boolean;

  isOpen: boolean;

  throwCancelError: boolean;
}

type TState = {
  modals: Array<Modal>;
};

interface ModalService {
  confirm: TModal;
  info: TModal;
  error: TModal;
  custom: TModal;
  subscribe: (callback: (state: TState) => void) => () => void;
  closeAll: (reason: TReason) => Promise<void>;
  dismissAll: (reason: TReason) => Promise<void>;
  close: ({ id: number, reason: TReason }) => Promise<void>;
  dismiss: ({ id: number, reason: TReason }) => Promise<void>;
}

export const ReactModalBridge: MemoExoticComponent<() => Element>;

export const modal: ModalService;
