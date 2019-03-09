// @flow

const sleep = (delayMs: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, delayMs));

export default sleep;
