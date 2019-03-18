import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { modalService } from '../../modal.service';
import { ModalDialog } from '../modal-dialog.jsx';

// eslint-disable-next-line react/prop-types
jest.mock('react-modal', () => ({ children, ...props }) => (
  <div className="react-modal-mock">
    <pre className="props">{JSON.stringify(props, null, 2)}</pre>
    {children}
  </div>
));

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

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe('<ModalDialog />', () => {
  describe('type `info`', () => {
    afterEach(async () => {
      await modalService.closeAll();
    });

    it('should match snapshot', () => {
      modalService.info({ title: 'Info title', body: 'Info body' });

      const tree = renderer.create(<ModalDialog />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('should contain modal content', () => {
      modalService.info({ title: 'Info title', body: 'Info body' });

      const wrapper = mount(<ModalDialog />);

      expect(wrapper.find('.rmb-modal-content').exists()).toBe(true);
    });

    it('should be closed', async () => {
      let isClosed = false;

      modalService
        .info({ title: 'Info title', body: 'Info body' })
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
});
