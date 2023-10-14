import React from 'react';
import { mount } from 'enzyme';
import { modalService } from '../../modal.service';
import { ModalDialog } from '../modal-dialog';
jest.mock('react-transition-group', () => ({
  // eslint-disable-next-line react/prop-types
  CSSTransition: ({ children, ...props }) => (
    <div className="CSSTransition-mock">
      <pre className="props">{JSON.stringify(props, null, 2)}</pre>
      {children}
    </div>
  ),
  // eslint-disable-next-line react/prop-types
  TransitionGroup: ({ children, ...props }) => (
    <div className="TransitionGroup-mock">
      <pre className="props">{JSON.stringify(props, null, 2)}</pre>
      {children}
    </div>
  )
}));

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

// TODO use following guides to fix these tests
// https://github.com/threepointone/react-act-examples
// https://github.com/facebook/react/issues/14769#issuecomment-462528230
// eslint-disable-next-line jest/no-disabled-tests
describe('<ModalDialog />', () => {
  /**
   * Suppress React 16.8 act() warnings globally.
   * The react teams fix won't be out of alpha until 16.9.0.
   * See also https://github.com/facebook/react/issues/14769#issuecomment-514589856
   */
  const consoleError = console.error; // eslint-disable-line no-console

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (
        !args[0].includes(
          'Warning: An update to %s inside a test was not wrapped in act'
        )
      ) {
        consoleError(...args);
      }
    });
  });
  describe('type `confirm`', () => {
    afterEach(async () => {
      await modalService.closeAll();
    });
    it('should contain modal content', () => {
      modalService.confirm({
        title: 'Confirm title',
        body: 'Confirm body'
      });
      const wrapper = mount(<ModalDialog />);
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(true);
    });
    it('should be closed', async () => {
      let isClosed = false;
      modalService
        .confirm({
          title: 'Confirm title',
          body: 'Confirm body'
        })
        .result.then(() => {
          isClosed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-btn-ok').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isClosed).toBe(true);
    });
    it('should be dismissed by clicking [Cancel] button', async () => {
      let isDismissed = false;
      modalService
        .confirm({
          title: 'Confirm title',
          body: 'Confirm body',
          throwCancelError: true
        })
        .result.catch(() => {
          isDismissed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-btn-cancel').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isDismissed).toBe(true);
    });
    it('should be dismissed by clicking [X] button', async () => {
      let isDismissed = false;
      modalService
        .confirm({
          title: 'Confirm title',
          body: 'Confirm body',
          throwCancelError: true
        })
        .result.catch(() => {
          isDismissed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-close').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isDismissed).toBe(true);
    });
  });
  describe('type `info`', () => {
    afterEach(async () => {
      await modalService.closeAll();
    });
    it('should contain modal content', () => {
      modalService.info({
        title: 'Info title',
        body: 'Info body'
      });
      const wrapper = mount(<ModalDialog />);
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(true);
    });
    it('should be closed', async () => {
      let isClosed = false;
      modalService
        .info({
          title: 'Info title',
          body: 'Info body'
        })
        .result.then(() => {
          isClosed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-btn-ok').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isClosed).toBe(true);
    });
    it('should be dismissed', async () => {
      let isDismissed = false;
      modalService
        .info({
          title: 'Info title',
          body: 'Info body',
          throwCancelError: true
        })
        .result.catch(() => {
          isDismissed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-close').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isDismissed).toBe(true);
    });
  });
  describe('type `error`', () => {
    afterEach(async () => {
      await modalService.closeAll();
    });
    it('should contain modal content', () => {
      modalService.error({
        title: 'Error title',
        body: 'Error body'
      });
      const wrapper = mount(<ModalDialog />);
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(true);
    });
    it('should be closed', async () => {
      let isClosed = false;
      modalService
        .error({
          title: 'Error title',
          body: 'Error body'
        })
        .result.then(() => {
          isClosed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-btn-ok').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isClosed).toBe(true);
    });
    it('should be dismissed', async () => {
      let isDismissed = false;
      modalService
        .error({
          title: 'Error title',
          body: 'Error body',
          throwCancelError: true
        })
        .result.catch(() => {
          isDismissed = true;
        });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-close').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isDismissed).toBe(true);
    });
  });
  describe('type `custom`', () => {
    const openCustomModal = (additionalParams = {}) => {
      return modalService.custom({
        title: 'Custom title',
        body: (props) => (
          <div className="custom-body">
            <div className="props-for-custom-component">
              {JSON.stringify(
                props,
                (key, value) => {
                  if (typeof value === 'function') {
                    return `function ${key}(){...}`;
                  }

                  return value;
                },
                2
              )}
            </div>
            <button
              type="button"
              className="btn-close" // eslint-disable-next-line react/prop-types, react/destructuring-assignment
              onClick={props.closeModal}>
              Close Modal
            </button>
          </div>
        ),
        ...additionalParams
      });
    };

    afterEach(async () => {
      await modalService.closeAll();
    });
    it('should contain modal content', () => {
      modalService.confirm({
        title: 'Confirm title',
        body: 'Confirm body'
      });
      const wrapper = mount(<ModalDialog />);
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(true);
    });
    it('should be closed', async () => {
      let isClosed = false;
      openCustomModal().result.then(() => {
        isClosed = true;
      });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.btn-close').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isClosed).toBe(true);
    });
    it('should be dismissed by clicking [X] button', async () => {
      let isDismissed = false;
      openCustomModal({
        throwCancelError: true
      }).result.catch(() => {
        isDismissed = true;
      });
      const wrapper = mount(<ModalDialog />);
      wrapper.find('.rmb-close').simulate('click');
      await flushPromises();
      expect(wrapper.find('.rmb-modal-content').exists()).toBe(false);
      expect(isDismissed).toBe(true);
    });
  });
});