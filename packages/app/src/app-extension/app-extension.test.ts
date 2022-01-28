import { initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { onDisable, onRun } from './app-extension';
import { App } from '../App';
import { act, renderHook } from '@minddrop/test-utils';
import { useAppStore } from '../useAppStore';

const core = initializeCore({ appId: 'app-id', extensionId: 'app' });
const initialView = { id: 'initial-view-id', title: 'View title' };
const secondView = { id: 'second-view-id', title: 'View 2 title' };

describe('app-extension', () => {
  beforeEach(() => {
    PersistentStore.setLocalValue(core, 'view', initialView);
    onRun(core);
  });

  afterEach(() => {
    PersistentStore.clearLocalCache();
  });

  describe('onRun', () => {
    it('loads current view from the local persistent store', () => {
      expect(App.getCurrentView()).toEqual(initialView);
    });

    it('updates the current view in the local persistent on change', (done) => {
      act(() => {
        App.openView(core, secondView);
      });

      core.addEventListener('persistent-store:update-local', () => {
        expect(PersistentStore.getLocalValue(core, 'view')).toEqual(secondView);
        done();
      });
    });
  });

  describe('onDisable', () => {
    it('resets the store', () => {
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
      expect(result.current.view.id).not.toBe('initial-view-id');
    });

    it('removes event listeners', () => {
      act(() => {
        App.addEventListener(core, 'app:open-view', jest.fn());

        onDisable(core);
      });

      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
