import Observer from '../observer';
describe('Check `observer` util', () => {
  it(
    'should should notify subscribers ' +
      'and then do not notify unsubscribed ones',
    () => {
      const sub1 = jest.fn();
      const sub2 = jest.fn();
      const observer = new Observer();
      const payload1 = {
        test: 1
      };
      observer.subscribe(sub1);
      observer.subscribe(sub2);
      observer.notify(payload1);
      expect(sub1).toHaveBeenCalledWith(payload1);
      expect(sub1).toHaveBeenCalledTimes(1);
      expect(sub2).toHaveBeenCalledWith(payload1);
      expect(sub2).toHaveBeenCalledTimes(1);
      const payload2 = [
        {
          test: 2
        },
        'yet another data'
      ];
      observer.unsubscribe(sub2);
      observer.notify(...payload2);
      expect(sub1).toHaveBeenCalledWith(...payload2);
      expect(sub1).toHaveBeenCalledTimes(2);
      expect(sub2).toHaveBeenCalledTimes(1);
    }
  );
});