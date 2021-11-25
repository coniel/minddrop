import { renderHook, act } from '@minddrop/test-utils';
import { UiExtensionConfig } from '../types';
import { useAppStore } from './useAppStore';

const uiExtension: UiExtensionConfig = {
  type: 'config',
  location: 'Sidebar:Toolbar:Item',
  id: 'id',
  source: 'core',
  element: {
    type: 'icon-button',
    icon: 'add',
    label: 'Add',
    onClick: jest.fn(),
  },
};

describe('useAppStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useAppStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('adds UI extensions', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtension);
    });

    expect(result.current.uiExtensions.length).toBe(1);
  });

  it('clears the state', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtension);
      result.current.addUiExtension(uiExtension);
      result.current.clear();
    });

    expect(result.current.uiExtensions.length).toBe(0);
  });

  it('removes UI extensions', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtension);
      result.current.removeUiExtension('id');
    });

    expect(result.current.uiExtensions.length).toBe(0);
  });
});
