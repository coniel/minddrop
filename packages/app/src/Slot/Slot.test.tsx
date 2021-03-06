import React from 'react';
import { render, cleanup, screen, renderHook, act } from '@minddrop/test-utils';
import { Slot } from './Slot';
import { UiExtensionConfig, UiExtensionElement } from '../types';
import { useAppStore } from '../useAppStore';

const uiExtensionConfig: UiExtensionConfig = {
  type: 'config',
  location: 'Sidebar:Toolbar:Item',
  id: 'config',
  source: 'core',
  element: {
    type: 'icon-button',
    icon: 'add',
    label: 'config',
    onClick: jest.fn(),
  },
};

const uiExtensionElement: UiExtensionElement = {
  type: 'component',
  location: 'Sidebar:PrimaryNav:Item',
  id: 'component',
  source: 'core',
  element: () => <div>element</div>,
};

describe.skip('<Slot />', () => {
  afterEach(cleanup);

  afterAll(() => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.clear();
    });
  });

  beforeAll(() => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtensionConfig);
      result.current.addUiExtension(uiExtensionElement);
    });
  });

  it('renders configs', () => {
    render(<Slot location="Sidebar:Toolbar:Item" />);

    screen.getByText('config');
  });

  it('renders elements', () => {
    render(<Slot location="Sidebar:PrimaryNav:Item" />);

    screen.getByText('element');
  });

  it('only renders location extensions', () => {
    render(<Slot location="Sidebar:PrimaryNav:Item" />);

    screen.getByText('element');
    expect(screen.queryByText('config')).toBe(null);
  });
});
