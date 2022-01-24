import React from 'react';
import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { App } from './App';
import { useAppStore, useUiExtensions } from '../useAppStore';
import { IconButtonConfig } from '../types';

const config: IconButtonConfig = {
  type: 'icon-button',
  icon: 'add',
  label: 'Add',
  onClick: jest.fn(),
};

const element = () => <span />;
const core = initializeCore({ appId: 'app-id', extensionId: 'app' });

describe('initializeApp', () => {
  afterEach(() => {
    const { result } = renderHook(() => useAppStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  describe('openView', () => {
    it('sets the current view in the store', () => {
      const { result } = renderHook(() => useAppStore((state) => state));

      act(() => {
        App.openView(core, { id: 'my-view', title: 'My view' });
      });

      expect(result.current.view.id).toBe('my-view');
    });

    it("dispatches a 'app:open-view' event", (done) => {
      function callback(payload) {
        expect(payload.data).toEqual({
          id: 'my-view',
          title: 'My view',
        });
        done();
      }

      core.addEventListener('app:open-view', callback);

      act(() => {
        App.openView(core, { id: 'my-view', title: 'My view' });
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
