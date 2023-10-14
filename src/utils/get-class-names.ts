export const getClassNames = (baseClassNames) => ({
  modalHeader: baseClassNames.modalHeader ?? 'rmb-modal-header',
  modalTitle: baseClassNames.modalTitle ?? 'rmb-modal-title',
  modalBody: baseClassNames.modalBody ?? 'rmb-modal-body',
  modalContent: baseClassNames.modalContent ?? 'rmb-modal-content',
  modalFooter: baseClassNames.modalFooter ?? 'rmb-modal-footer',
  modalShow: baseClassNames.modalShow ?? 'rmb-modal-show',
  btn: baseClassNames.btn ?? 'rmb-btn',
  btnPrimary: baseClassNames.btnPrimary ?? 'rmb-btn-primary',
  btnDefault: baseClassNames.btnDefault ?? 'rmb-btn-default',
  btnOk: baseClassNames.btnOk ?? 'rmb-btn-ok',
  btnCancel: baseClassNames.btnCancel ?? 'rmb-btn-cancel',
  close: baseClassNames.close ?? 'rmb-close',
  modal: baseClassNames.modal ?? 'rmb-modal',
  baseModalContainer:
    baseClassNames.baseModalContainer ?? 'rmb-base-modal-container',
  overlay: baseClassNames.overlay ?? 'rmb-overlay',
  content: baseClassNames.content ?? 'rmb-content',
  portal: baseClassNames.portal ?? 'rmb-portal',
  bodyOpen: baseClassNames.bodyOpen ?? 'rmb-body-open'
});