import { Store, createStore } from '../store';
describe('Check `store` util', () => {
  describe('`createStore` method', () => {
    it('should return `Store` instance', () => {
      const result = createStore({});
      expect(result).toBeInstanceOf(Store);
    });
  });
  describe('`Store` class', () => {
    it('should return initial state by invoking `getState` method', () => {
      const initialState = {
        test: 123
      };
      const store = new Store(initialState);
      const result = store.getState();
      expect(result).toBe(initialState);
    });
    it('should merge new state by invoking `setState` method', () => {
      const initialState = {
        a: 'old value',
        b: 2
      };
      const newState = {
        a: 'new value'
      };
      const store = new Store(initialState);
      store.setState(newState);
      const result = store.getState();
      expect(result).toEqual({ ...initialState, ...newState });
    });
    it(
      'should notify subscribers by invoking `setState` method ' +
        'and then do not notify unsubscribed ones',
      () => {
        const initialState = {
          a: 'old value',
          b: 2
        };
        const newState = {
          a: 'new value'
        };
        const store = new Store(initialState);
        const sub = jest.fn();
        const unsubscribe = store.subscribe(sub);
        store.setState(newState);
        const result = store.getState();
        expect(sub).toHaveBeenCalledWith(result);
        expect(sub).toHaveBeenCalledTimes(1);
        unsubscribe();
        store.setState({
          just: 'something that will be unsaid'
        });
        expect(sub).toHaveBeenCalledTimes(1);
      }
    );
  });
});