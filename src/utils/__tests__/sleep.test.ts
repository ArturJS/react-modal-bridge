import { sleep } from '../sleep';

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('Check `sleep` util', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('should NOT be resolved before time is up', async () => {
    let isDone = false;
    const timeMs = 5000;
    sleep(timeMs).then(() => {
      isDone = true;
    });
    jest.advanceTimersByTime(timeMs - 1);
    await flushPromises();
    expect(isDone).toBe(false);
  });
  it('should be resolved after time is up', async () => {
    let isDone = false;
    const timeMs = 5000;
    sleep(timeMs).then(() => {
      isDone = true;
    });
    jest.advanceTimersByTime(timeMs);
    await flushPromises();
    expect(isDone).toBe(true);
  });
});