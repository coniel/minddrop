import React from 'react';
import { renderHook, act } from '@minddrop/test-utils';
import {
  ViewNotRegisteredError,
  ViewInstanceNotFoundError,
  VIEWS_TEST_DATA,
} from '@minddrop/views';
import { App } from './App';
import { useAppStore, useUiExtensions } from '../useAppStore';
import { IconButtonConfig } from '../types';
import { core, cleanup, setup } from '../test-utils';
import { initializeCore } from '@minddrop/core';

const { viewInstance1, staticView, unregisteredView, instanceView } =
  VIEWS_TEST_DATA;

const config: IconButtonConfig = {
  type: 'icon-button',
  icon: 'add',
  label: 'Add',
  onClick: jest.fn(),
};

const element = () => <span />;

describe('App', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('openView', () => {
    it('sets the current view ID in the store', () => {
      const { result } = renderHook(() => useAppStore((state) => state));

      act(() => {
        App.openView(core, staticView.id);
      });

      expect(result.current.view).toBe(staticView.id);
    });

    it("dispatches a 'app:open-view' event", (done) => {
      function callback(payload) {
        expect(payload.data.view).toEqual(staticView);
        expect(payload.data.instance).toBeNull();
        done();
      }

      core.addEventListener('app:open-view', callback);

      act(() => {
        App.openView(core, staticView.id);
      });
    });

    it('throws a ViewNotRegisteredError if the view is not registered', () => {
      expect(() => App.openView(core, unregisteredView.id)).toThrowError(
        ViewNotRegisteredError,
      );
    });
  });

  describe('openViewInstance', () => {
    it('sets the current view ID in the store', () => {
      const { result } = renderHook(() => useAppStore((state) => state));

      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });

      expect(result.current.view).toEqual(viewInstance1.view);
    });

    it('sets the current view instance in the store', () => {
      const { result } = renderHook(() => useAppStore((state) => state));

      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });

      expect(result.current.viewInstance).toEqual(viewInstance1.id);
    });

    it("dispatches a 'app:open-view' event", (done) => {
      function callback(payload) {
        expect(payload.data.view).toEqual(instanceView);
        expect(payload.data.instance).toEqual(viewInstance1);
        done();
      }

      core.addEventListener('app:open-view', callback);

      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });
    });

    it('throws a ViewInstanceNotFoundError if the view instance does not exist', () => {
      expect(() =>
        App.openViewInstance(core, unregisteredView.id),
      ).toThrowError(ViewInstanceNotFoundError);
    });
  });

  describe('getCurrentView', () => {
    it('returns the current view', () => {
      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });

      expect(App.getCurrentView()).toEqual({
        view: instanceView,
        instance: viewInstance1,
      });
    });
  });

  it('adds UI extensions', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', config);
    });

    expect(result.current.uiExtensions.length).toBe(1);
  });

  it('applies appropriate type to UiExtension', () => {
    const { result: primaryNav } = renderHook(() =>
      useUiExtensions('Sidebar:PrimaryNav:Item'),
    );
    const { result: toolbar } = renderHook(() =>
      useUiExtensions('Sidebar:BottomToolbar:Item'),
    );

    act(() => {
      App.addUiExtension(core, 'Sidebar:PrimaryNav:Item', element);
      App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', config);
    });

    expect(primaryNav.current[0].type).toBe('component');
    expect(toolbar.current[0].type).toBe('config');
  });

  it('removes UI extensions', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', config);
      App.removeUiExtension('Sidebar:BottomToolbar:Item', config);
    });

    expect(result.current.uiExtensions.length).toBe(0);
  });

  it('removes all UI extensions added by the extension from a specified location', () => {
    const { result } = renderHook(() => useAppStore((state) => state));
    const core2 = initializeCore({ appId: 'app-id', extensionId: 'extension' });

    act(() => {
      App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', config);
      App.addUiExtension(core2, 'Sidebar:BottomToolbar:Item', config);
      App.addUiExtension(core2, 'Sidebar:BottomToolbar:Item', config);
      App.addUiExtension(core2, 'Sidebar:BottomToolbar:Below', config);
      App.removeAllUiExtensions(core2, 'Sidebar:BottomToolbar:Item');
    });

    expect(result.current.uiExtensions.length).toBe(2);
  });

  it('removes all UI extensions added by the extension', () => {
    const { result } = renderHook(() => useAppStore((state) => state));
    const core2 = initializeCore({ appId: 'app-id', extensionId: 'extension' });

    act(() => {
      App.addUiExtension(core, 'Sidebar:BottomToolbar:Item', config);
      App.addUiExtension(core2, 'Sidebar:BottomToolbar:Item', config);
      App.addUiExtension(core2, 'Sidebar:BottomToolbar:Item', config);
      App.addUiExtension(core2, 'Sidebar:BottomToolbar:Below', config);
      App.removeAllUiExtensions(core2);
    });

    expect(result.current.uiExtensions.length).toBe(1);
  });
});
