import React from 'react';
import { renderHook, act } from '@minddrop/test-utils';
import { initializeApp } from './initializeApp';
import { useAppStore, useUiExtensions } from '../useAppStore';
import { IconButtonConfig } from '../types';
import { UiComponentConfigMap } from '../Slot';

const config: IconButtonConfig = {
  type: 'icon-button',
  icon: 'add',
  label: 'Add',
  onClick: jest.fn(),
};

const element = () => <span />;

const componentMap = {
  // @ts-ignore
  'icon-button': ({ label }) => <div>{label}</div>,
} as UiComponentConfigMap;

describe('initializeApp', () => {
  afterEach(() => {
    const { result } = renderHook(() => useAppStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('extends the UI', () => {
    const app = initializeApp({ componentMap });
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      app.extendUi('test', 'Sidebar:BottomToolbar:Item', config);
    });

    expect(result.current.uiExtensions.length).toBe(1);
  });

  it('applies appropriate type to UiExtension', () => {
    const app = initializeApp({ componentMap });
    const { result: primaryNav } = renderHook(() =>
      useUiExtensions('Sidebar:PrimaryNav:Item'),
    );
    const { result: toolbar } = renderHook(() =>
      useUiExtensions('Sidebar:BottomToolbar:Item'),
    );

    act(() => {
      app.extendUi('test', 'Sidebar:PrimaryNav:Item', element);
      app.extendUi('test', 'Sidebar:BottomToolbar:Item', config);
    });

    expect(primaryNav.current[0].type).toBe('component');
    expect(toolbar.current[0].type).toBe('config');
  });
});
