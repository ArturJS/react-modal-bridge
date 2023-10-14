import React, { Component } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import * as focusManager from './helpers/focusManager';
import scopeTab from './helpers/scopeTab';
import * as ariaAppHider from './helpers/ariaAppHider';
import * as classList from './helpers/classList';
const TAB_KEY = 9;
const ESC_KEY = 27;
let ariaHiddenInstances = 0;

export type ModalPortalProps = InferProps<typeof ModalPortal.propTypes>

interface State {
  isOpen: boolean;
  beforeClose: boolean;
  afterOpen: boolean;
  closesAt?: number | null;
}

type Attributes = Record<string, string>;

export default class ModalPortal extends Component<ModalPortalProps, State> {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    defaultStyles: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),
    style: PropTypes.shape({
      content: PropTypes.object,
      overlay: PropTypes.object
    }),

    /* eslint-disable react/require-default-props, react/forbid-prop-types */
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    overlayClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    htmlOpenClassName: PropTypes.string,
    ariaHideApp: PropTypes.bool,
    appElement: PropTypes.instanceOf(window.HTMLElement),
    onAfterOpen: PropTypes.func,
    onAfterClose: PropTypes.func,
    onRequestClose: PropTypes.func,
    closeTimeoutMS: PropTypes.number,
    shouldFocusAfterRender: PropTypes.bool,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldReturnFocusAfterClose: PropTypes.bool,
    role: PropTypes.string,
    contentLabel: PropTypes.string,
    aria: PropTypes.object,
    data: PropTypes.object,
    children: PropTypes.node,
    shouldCloseOnEsc: PropTypes.bool,
    overlayRef: PropTypes.func,
    contentRef: PropTypes.func,
    id: PropTypes.string,
    cn: PropTypes.shape({
      content: PropTypes.string,
      overlay: PropTypes.string,
      portal: PropTypes.string,
      bodyOpen: PropTypes.string
    })
    /* eslint-enable react/require-default-props, react/forbid-prop-types */
  };
  static defaultProps = {
    style: {
      overlay: {},
      content: {}
    },
    defaultStyles: {},
    className: '',
    overlayClassName: ''
  };

  shouldClose: boolean | null;
  moveFromContentToOverlay: boolean | null;
  closeTimer?: number;
  overlay?: HTMLDivElement;
  content?: HTMLDivElement;
  node?: HTMLDivElement;

  constructor(props: ModalPortalProps) {
    super(props);
    this.state = {
      isOpen: false,
      afterOpen: false,
      beforeClose: false
    };
    this.shouldClose = null;
    this.moveFromContentToOverlay = null;
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.isOpen) {
      this.open();
    }
  }

  componentDidUpdate(prevProps: ModalPortalProps, prevState: ModalPortalProps) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.props.cn && prevProps.cn?.bodyOpen !== this.props.cn?.bodyOpen) {
        // eslint-disable-next-line no-console
        console.warn(
          "react-modal-bridge: 'bodyOpen' prop has been modified. " +
            'This may cause unexpected behavior when multiple modals are open.'
        );
      }

      // eslint-disable-next-line react/destructuring-assignment
      if (prevProps.htmlOpenClassName !== this.props.htmlOpenClassName) {
        // eslint-disable-next-line no-console
        console.warn(
          "react-modal-bridge: 'htmlOpenClassName' prop has been modified. " +
            'This may cause unexpected behavior when multiple modals are open.'
        );
      }
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.isOpen && !prevProps.isOpen) {
      this.open(); // eslint-disable-next-line react/destructuring-assignment
    } else if (!this.props.isOpen && prevProps.isOpen) {
      this.close();
    }

    // Focus only needs to be set once when the modal is being opened
    if (
      // eslint-disable-next-line react/destructuring-assignment
      this.props.shouldFocusAfterRender && // eslint-disable-next-line react/destructuring-assignment
      this.state.isOpen &&
      !prevState.isOpen
    ) {
      this.focusContent();
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.isOpen) {
      this.afterClose();
    }

    clearTimeout(this.closeTimer);
  }

  setOverlayRef = (overlay: HTMLDivElement) => {
    this.overlay = overlay;
    // eslint-disable-next-line no-unused-expressions, react/destructuring-assignment
    this.props.overlayRef && this.props.overlayRef(overlay);
  };
  setContentRef = (content: HTMLDivElement) => {
    this.content = content;
    // eslint-disable-next-line no-unused-expressions, react/destructuring-assignment
    this.props.contentRef && this.props.contentRef(content);
  };
  afterClose = () => {
    const { appElement, ariaHideApp, htmlOpenClassName, cn } = this.props;
    // Remove classes.
    // eslint-disable-next-line no-unused-expressions
    cn?.bodyOpen && classList.remove(document.body, cn.bodyOpen);
    // eslint-disable-next-line no-unused-expressions
    htmlOpenClassName &&
      classList.remove(
        document.getElementsByTagName('html')[0],
        htmlOpenClassName
      );

    // Reset aria-hidden attribute if all modals have been removed
    if (ariaHideApp && ariaHiddenInstances > 0) {
      ariaHiddenInstances -= 1;

      if (ariaHiddenInstances === 0) {
        ariaAppHider.show(appElement);
      }
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.shouldFocusAfterRender) {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.props.shouldReturnFocusAfterClose) {
        focusManager.returnFocus();
        focusManager.teardownScopedFocus();
      } else {
        focusManager.popWithoutFocus();
      }
    }

    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.onAfterClose) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.onAfterClose();
    }
  };
  open = () => {
    this.beforeOpen();

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.afterOpen && this.state.beforeClose) {
      clearTimeout(this.closeTimer);
      this.setState({
        beforeClose: false
      });
    } else {
      // eslint-disable-next-line react/destructuring-assignment
      if (this.props.shouldFocusAfterRender) {
        focusManager.setupScopedFocus(this.node);
        focusManager.markForFocusLater();
      }

      this.setState(
        {
          isOpen: true
        },
        () => {
          this.setState({
            afterOpen: true
          });

          // eslint-disable-next-line react/destructuring-assignment
          if (this.props.isOpen && this.props.onAfterOpen) {
            // eslint-disable-next-line react/destructuring-assignment
            this.props.onAfterOpen({
              overlayEl: this.overlay,
              contentEl: this.content
            });
          }
        }
      );
    }
  };
  close = () => {
    const { closeTimeoutMS } = this.props

    if (closeTimeoutMS && closeTimeoutMS > 0) {
      this.closeWithTimeout();
    } else {
      this.closeWithoutTimeout();
    }
  };
  // Don't steal focus from inner elements
  focusContent = () =>
    this.content && !this.contentHasFocus() && this.content.focus();
  closeWithTimeout = () => {
    const { closeTimeoutMS } = this.props;
    const closesAt = closeTimeoutMS
      ? Date.now() + closeTimeoutMS
      : 0;

    this.setState(
      {
        beforeClose: true,
        closesAt
      },
      () => {
        const { closesAt } = this.state;

        if (closesAt) {
          // @ts-ignore
          this.closeTimer = setTimeout(
            this.closeWithoutTimeout, // eslint-disable-next-line react/destructuring-assignment
            closesAt - Date.now()
          );
        }
      }
    );
  };
  closeWithoutTimeout = () => {
    this.setState(
      {
        beforeClose: false,
        isOpen: false,
        afterOpen: false,
        closesAt: null
      },
      this.afterClose
    );
  };
  handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === TAB_KEY) {
      scopeTab(this.content, event);
    }

    const { shouldCloseOnEsc } = this.props;

    if (shouldCloseOnEsc && event.keyCode === ESC_KEY) {
      event.stopPropagation();
      this.requestClose(event);
    }
  };
  handleOverlayOnClick: React.MouseEventHandler = (event) => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    const { shouldCloseOnOverlayClick } = this.props;

    if (this.shouldClose && shouldCloseOnOverlayClick) {
      if (this.ownerHandlesClose()) {
        this.requestClose(event);
      } else {
        this.focusContent();
      }
    }

    this.shouldClose = null;
  };
  handleContentOnMouseUp = () => {
    this.shouldClose = false;
  };
  handleOverlayOnMouseDown: React.MouseEventHandler = (event) => {
    const { shouldCloseOnOverlayClick } = this.props;

    if (!shouldCloseOnOverlayClick && event.target === this.overlay) {
      event.preventDefault();
    }
  };
  handleContentOnClick = () => {
    this.shouldClose = false;
  };
  handleContentOnMouseDown = () => {
    this.shouldClose = false;
  };
  requestClose = (
    event: 
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent
  ) => {
    if (this.ownerHandlesClose()) {
      const { onRequestClose } = this.props;
      onRequestClose?.(event);
    }
  };
  // eslint-disable-next-line react/destructuring-assignment
  ownerHandlesClose = () => this.props.onRequestClose;
  // eslint-disable-next-line react/destructuring-assignment
  shouldBeClosed = () => !this.state.isOpen && !this.state.beforeClose;
  contentHasFocus = () =>
    document.activeElement === this.content ||
    this.content?.contains(document.activeElement);
  buildClassName = (
    which: 'content' | 'overlay' | 'portal' | 'bodyOpen',
    additional?: {
      base?: string;
      afterOpen?: string;
      beforeClose?: string;
    } | string,
  ): string => {
    const { cn } = this.props
    const base = cn ? cn[which] : '';

    const classNames =
      typeof additional === 'object'
        ? additional
        : {
            base,
            afterOpen: `${base}-after-open`,
            beforeClose: `${base}-before-close`
          };
    let className = classNames.base as string;
    const { afterOpen, beforeClose } = this.state;

    if (afterOpen) {
      className = `${className} ${classNames.afterOpen}`;
    }

    if (beforeClose) {
      className = `${className} ${classNames.beforeClose}`;
    }

    return typeof additional === 'string' && additional
      ? `${className} ${additional}`
      : className;
  };
  attributesFromObject = (prefix: string, items: Attributes) =>
    Object.keys(items).reduce((acc: Attributes, name) => {
      acc[`${prefix}-${name}`] = items[name] as string;
      return acc;
    }, {});

  beforeOpen() {
    const { appElement, ariaHideApp, htmlOpenClassName, cn } = this.props;
    // Add classes.
    // eslint-disable-next-line no-unused-expressions
    cn?.bodyOpen && classList.add(document.body, cn.bodyOpen);
    // eslint-disable-next-line no-unused-expressions
    htmlOpenClassName &&
      classList.add(
        document.getElementsByTagName('html')[0],
        htmlOpenClassName
      );

    if (ariaHideApp) {
      ariaHiddenInstances += 1;
      ariaAppHider.hide(appElement);
    }
  }

  render() {
    const {
      id,
      className,
      overlayClassName,
      defaultStyles,
      style,
      role,
      contentLabel,
      aria,
      data,
      children
    } = this.props;
    const contentStyles = className ? {} : defaultStyles?.content;
    const overlayStyles = overlayClassName ? {} : defaultStyles?.overlay;

    /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    return this.shouldBeClosed() ? null : (
      <div
        ref={this.setOverlayRef}
        className={this.buildClassName('overlay', overlayClassName ?? '')}
        style={{ ...overlayStyles, ...style?.overlay }}
        onClick={this.handleOverlayOnClick}
        onMouseDown={this.handleOverlayOnMouseDown}>
        <div
          id={id ?? undefined}
          ref={this.setContentRef}
          style={{ ...contentStyles, ...style?.content }}
          className={this.buildClassName('content', className ?? '')}
          tabIndex={-1}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleContentOnMouseDown}
          onMouseUp={this.handleContentOnMouseUp}
          onClick={this.handleContentOnClick}
          role={role ?? undefined}
          aria-label={contentLabel ?? undefined}
          {...this.attributesFromObject('aria', (aria as Attributes) || {})}
          {...this.attributesFromObject('data', (data as Attributes) || {})}>
          {children}
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  }
}