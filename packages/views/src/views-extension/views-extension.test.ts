import { onDisable, onRun } from './views-extension';
import { cleanup, core } from '../test-utils';
import { Views } from '../Views';
import { Resources } from '@minddrop/resources';

describe('topics extension', () => {
  afterEach(cleanup);

  describe('onRun', () => {
    it('registers the `views:view-instance` resource', () => {
      // Run the extension
      onRun(core);

      // The 'views:view-instance' resource should be registered
      expect(Resources.get('views:view-instance')).toBeDefined();
    });
  });

  describe('onDisable', () => {
    it('removes event listeners', () => {
      // Add an event listener
      Views.addEventListener(core, 'views:view:register', jest.fn());

      // Disable the extension
      onDisable(core);

      // Event listener should have been removed
      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
