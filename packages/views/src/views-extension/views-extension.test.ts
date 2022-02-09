import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from './views-extension';
import { cleanup, core, staticView, viewInstance1 } from '../tests';
import { Views } from '../Views';
import { getViewInstance } from '../getViewInstance';
import { ViewInstanceNotFoundError, ViewNotRegisteredError } from '../errors';
import { getView } from '../getView';
import { registerView } from '../registerView';

describe('topics extension', () => {
  afterEach(cleanup);

  describe('onRun', () => {
    describe('view instance resource registration', () => {
      it('loads view instances', () => {
        onRun(core);

        const [connector] = core.getResourceConnectors();
        connector.onLoad([viewInstance1]);

        expect(getViewInstance(viewInstance1.id)).toEqual(viewInstance1);
      });

      it('handles added/updated view instances', () => {
        onRun(core);

        const [connector] = core.getResourceConnectors();
        connector.onChange({ ...viewInstance1, foo: 'foo' }, false);

        expect(getViewInstance(viewInstance1.id)).toEqual({
          ...viewInstance1,
          foo: 'foo',
        });
      });

      it('handles deleted view instances', () => {
        onRun(core);

        const [connector] = core.getResourceConnectors();
        connector.onLoad([viewInstance1]);
        connector.onChange(viewInstance1, true);

        expect(() => getViewInstance(viewInstance1.id)).toThrowError(
          ViewInstanceNotFoundError,
        );
      });
    });
  });

  describe('onDisable', () => {
    it('clears the store', () => {
      onRun(core);

      const [connector] = core.getResourceConnectors();
      connector.onLoad([viewInstance1]);
      registerView(core, staticView);
      onDisable(core);

      expect(() => getView(staticView.id)).toThrowError(ViewNotRegisteredError);
      expect(() => getViewInstance(viewInstance1.id)).toThrowError(
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
