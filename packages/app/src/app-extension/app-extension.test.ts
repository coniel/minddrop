import { PersistentStore } from '@minddrop/persistent-store';
import { onDisable, onRun } from './app-extension';
import { App } from '../App';
import { act, renderHook } from '@minddrop/test-utils';
import { useAppStore } from '../useAppStore';
import {
  cleanup,
  setup,
  core,
  viewInstance1,
  instanceView,
  viewInstance2,
  staticView,
} from '../tests';

describe('app-extension', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    cleanup();
    PersistentStore.clearLocalCache();
  });

  describe('onRun', () => {
    it('loads current view from the local persistent store', () => {
      PersistentStore.setLocalValue(core, 'view', staticView.id);
      PersistentStore.setLocalValue(core, 'viewInstance', null);

      onRun(core);

      expect(App.getCurrentView()).toEqual({
        view: staticView,
        instance: null,
      });
    });

    it('loads current view instance from the local persistent store', () => {
      PersistentStore.setLocalValue(core, 'view', viewInstance1.view);
      PersistentStore.setLocalValue(core, 'viewInstance', viewInstance1.id);

      onRun(core);

      expect(App.getCurrentView()).toEqual({
        view: instanceView,
        instance: viewInstance1,
      });
    });

    it('updates the current view in the local persistent on change', (done) => {
      PersistentStore.setLocalValue(core, 'view', viewInstance1.view);
      PersistentStore.setLocalValue(core, 'viewInstance', viewInstance1.id);

      onRun(core);

      act(() => {
        App.openViewInstance(core, viewInstance2.id);
      });

      core.addEventListener('persistent-store:update-local', () => {
        expect(PersistentStore.getLocalValue(core, 'view')).toEqual(
          viewInstance2.view,
        );
        expect(PersistentStore.getLocalValue(core, 'viewInstance')).toEqual(
          viewInstance2.id,
        );
        done();
      });
    });
  });

  describe('onDisable', () => {
    it('resets the store', () => {
      onRun(core);
      const { result } = renderHook(() => useAppStore());

      act(() => {
        App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', {
          type: 'icon-button',
          label: 'Button',
          icon: 'settings',
          onClick: jest.fn(),
        });
        onDisable(core);
      });

      expect(result.current.uiExtensions.length).toBe(0);
      expect(result.current.view).not.toBe('initial-view-id');
    });

    it('removes event listeners', () => {
      onRun(core);

      act(() => {
        App.addEventListener(core, 'app:open-view', jest.fn());

        onDisable(core);
      });

      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
