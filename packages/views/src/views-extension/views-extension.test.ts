import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from './views-extension';
import { cleanup, core, staticView, viewInstance } from '../tests';
import { Views } from '../Views';
import { getViewInstance } from '../getViewInstance';
import { ViewInstanceNotFoundError, ViewNotRegisteredError } from '../errors';
import { getView } from '../getView';
import { registerView } from '../registerView';

describe('topics extension', () => {
  afterEach(() => {
    cleanup();
  });

  describe('onRun', () => {
    describe('view instance resource registration', () => {
      it('loads view instances', () => {
        onRun(core);

        const [connector] = core.getResourceConnectors();
        connector.onLoad([viewInstance]);

        expect(getViewInstance(viewInstance.id)).toEqual(viewInstance);
      });

      it('handles added/updated view instances', () => {
        onRun(core);

        const [connector] = core.getResourceConnectors();
        connector.onChange({ ...viewInstance, foo: 'foo' }, false);

        expect(getViewInstance(viewInstance.id)).toEqual({
          ...viewInstance,
          foo: 'foo',
        });
      });

      it('handles deleted view instances', () => {
        onRun(core);

        const [connector] = core.getResourceConnectors();
        connector.onLoad([viewInstance]);
        connector.onChange(viewInstance, true);

        expect(() => getViewInstance(viewInstance.id)).toThrowError(
          ViewInstanceNotFoundError,
        );
      });
    });
  });

  describe('onDisable', () => {
    it('clears the store', () => {
      onRun(core);

      const [connector] = core.getResourceConnectors();
      connector.onLoad([viewInstance]);
      registerView(core, staticView);
      onDisable(core);

      expect(() => getView(staticView.id)).toThrowError(ViewNotRegisteredError);
      expect(() => getViewInstance(viewInstance.id)).toThrowError(
        ViewInstanceNotFoundError,
      );
    });

    it('removes event listeners', () => {
      onRun(core);
      Views.addEventListener(core, 'views:register', jest.fn());

      act(() => {
        onDisable(core);
        expect(core.hasEventListeners()).toBe(false);
      });
    });
  });
});
