import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import ModalPortal from './base-modal-portal.jsx';
import * as ariaAppHider from './helpers/ariaAppHider';

function getParentElement(parentSelector) {
  return parentSelector();
}

class Modal extends Component {
  static setAppElement(element) {
    ariaAppHider.setElement(element);
  }

  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    /* eslint-disable react/require-default-props, react/forbid-prop-types */
    htmlOpenClassName: PropTypes.string,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        base: PropTypes.string.isRequired,
        afterOpen: PropTypes.string.isRequired,
        beforeClose: PropTypes.string.isRequired
      })
    ]),
    overlayClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        base: PropTypes.string.isRequired,
        afterOpen: PropTypes.string.isRequired,
        beforeClose: PropTypes.string.isRequired
      })
    ]),
    appElement: PropTypes.instanceOf(window.HTMLElement),
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    ariaHideApp: PropTypes.bool,
    shouldFocusAfterRender: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldReturnFocusAfterClose: PropTypes.bool,
    parentSelector: PropTypes.func,
    aria: PropTypes.object,
    data: PropTypes.object,
    role: PropTypes.string,
    contentLabel: PropTypes.string,
    shouldCloseOnEsc: PropTypes.bool,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func,
    cn: PropTypes.shape({
      content: PropTypes.string,
      overlay: PropTypes.string,
      portal: PropTypes.string,
      bodyOpen: PropTypes.string
    })
    /* eslint-disable react/require-default-props, react/forbid-prop-types */
  };
  /* eslint-enable react/no-unused-prop-types */

  static defaultProps = {
    role: 'dialog',
    ariaHideApp: true,
    closeTimeoutMS: 0,
    shouldFocusAfterRender: true,
    shouldCloseOnEsc: true,
    shouldCloseOnOverlayClick: true,
    shouldReturnFocusAfterClose: true,
    parentSelector: () => document.body
  };

  // eslint-disable-next-line react/sort-comp
  static defaultStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '40px',
      left: '40px',
      right: '40px',
      bottom: '40px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  };

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.node.className = this.props.cn.portal;

    // eslint-disable-next-line react/destructuring-assignment
    const parent = getParentElement(this.props.parentSelector);
    parent.appendChild(this.node);
  }

  componentDidUpdate(prevProps, _, snapshot) {
    // eslint-disable-next-line no-shadow, react/destructuring-assignment
    const { portal } = this.props.cn.portal;

    if (prevProps.cn.portal !== portal) {
      this.node.className = portal;
    }

    const { prevParent, nextParent } = snapshot;
    if (nextParent !== prevParent) {
      prevParent.removeChild(this.node);
      nextParent.appendChild(this.node);
    }
  }

  componentWillUnmount() {
    if (!this.node || !this.portal) return;

    const { state } = this.portal;
    const now = Date.now();
    const { closeTimeoutMS } = this.props;
    const closesAt =
      state.isOpen &&
      closeTimeoutMS &&
      (state.closesAt || now + closeTimeoutMS);

    if (closesAt) {
      if (!state.beforeClose) {
        this.portal.closeWithTimeout();
      }

      setTimeout(this.removePortal, closesAt - now);
    } else {
      this.removePortal();
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const prevParent = getParentElement(prevProps.parentSelector);
    // eslint-disable-next-line react/destructuring-assignment
    const nextParent = getParentElement(this.props.parentSelector);
    return { prevParent, nextParent };
  }

  removePortal = () => {
    // eslint-disable-next-line react/destructuring-assignment
    const parent = getParentElement(this.props.parentSelector);
    if (parent) {
      parent.removeChild(this.node);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        "react-modal-bridge: 'parentSelector' prop did not returned any DOM " +
          'element. Make sure that the parent element is unmounted to ' +
          'avoid any memory leaks.'
      );
    }
  };

  portalRef = ref => {
    this.portal = ref;
  };

  renderPortal = props => {
    const portal = createPortal(
      this,
      <ModalPortal defaultStyles={Modal.defaultStyles} {...props} />,
      this.node
    );
    this.portalRef(portal);
  };

  render() {
    if (!this.node) {
      this.node = document.createElement('div');
    }

    return createPortal(
      <ModalPortal
        ref={this.portalRef}
        defaultStyles={Modal.defaultStyles}
        {...this.props}
      />,
      this.node
    );
  }
}

export default Modal;
