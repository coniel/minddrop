import React from 'react';
import { renderHook, act } from '@minddrop/test-utils';
import {
  ViewNotRegisteredError,
  Views,
  VIEWS_TEST_DATA,
} from '@minddrop/views';
import { App } from './App';
import { useAppStore, useUiExtensions } from '../useAppStore';
import { IconButtonConfig } from '../types';
import { core, cleanup, setup } from '../test-utils';
import { initializeCore } from '@minddrop/core';
import { ResourceDocumentNotFoundError } from '@minddrop/resources';

const { viewInstance1, staticViewConfig, instanceViewConfig } = VIEWS_TEST_DATA;

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
        App.openView(core, staticViewConfig.id);
      });

      expect(result.current.view).toBe(staticViewConfig.id);
    });

    it("dispatches a 'app:view:open' event", (done) => {
      core.addEventListener('app:view:open', (payload) => {
        expect(payload.data.view).toEqual(Views.get(staticViewConfig.id));
        expect(payload.data.instance).toBeNull();
        done();
      });

      act(() => {
        App.openView(core, staticViewConfig.id);
      });
    });

    it('throws a ViewNotRegisteredError if the view is not registered', () => {
      expect(() => App.openView(core, 'unregistered')).toThrowError(
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

      expect(result.current.view).toEqual(viewInstance1.type);
    });

    it('sets the current view instance in the store', () => {
      const { result } = renderHook(() => useAppStore((state) => state));

      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });

      expect(result.current.viewInstance).toEqual(viewInstance1.id);
    });

    it("dispatches a 'app:view:open' event", (done) => {
      core.addEventListener('app:view:open', (payload) => {
        expect(payload.data.view).toEqual(Views.get(instanceViewConfig.id));
        expect(payload.data.instance).toEqual(viewInstance1);
        done();
      });

      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });
    });

    it('throws a ViewInstanceNotFoundError if the view instance does not exist', () => {
      expect(() => App.openViewInstance(core, 'unregistered')).toThrowError(
        ResourceDocumentNotFoundError,
      );
    });
  });

  describe('getCurrentView', () => {
    it('returns the current view', () => {
      act(() => {
        App.openViewInstance(core, viewInstance1.id);
      });

      const registeredViewConfig = Views.get(instanceViewConfig.id);

      expect(App.getCurrentView()).toEqual({
        view: registeredViewConfig,
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
    const core2 = initializeCore({ appId: 'app', extensionId: 'extension' });

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
    const core2 = initializeCore({ appId: 'app', extensionId: 'extension' });

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
