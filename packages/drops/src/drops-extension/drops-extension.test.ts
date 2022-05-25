import { onDisable, onRun } from './drops-extension';
import { Drops } from '../Drops';
import { cleanup, core, setup } from '../test-utils';

describe('drops extension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('onRun', () => {});

  describe('onDisable', () => {
    it('removes event listeners', () => {
      onRun(core);
      Drops.addEventListener(core, 'drops:drop:create', jest.fn());

      onDisable(core);
      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
