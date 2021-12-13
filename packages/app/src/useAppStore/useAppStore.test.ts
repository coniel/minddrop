import { renderHook, act } from '@minddrop/test-utils';
import { UiExtensionConfig } from '../types';
import { useAppStore } from './useAppStore';

const uiExtension: UiExtensionConfig = {
  type: 'config',
  location: 'Sidebar:Toolbar:Item',
  id: 'id',
  source: 'extension-id',
  element: {
    type: 'icon-button',
    icon: 'add',
    label: 'Add',
    onClick: jest.fn(),
  },
};
const uiExtension2 = {
  ...uiExtension,
  id: 'id-2',
  source: 'extension-id',
  location: 'Sidebar:Toolbar:Below',
};
const uiExtension3 = {
  ...uiExtension,
  id: 'id-3',
  source: 'extension-id-2',
};

describe('useAppStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useAppStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('sets the view', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.setView({ id: 'my-view', title: 'My view' });
    });

    expect(result.current.view.id).toBe('my-view');
  });

  it('add a UI extension', () => {
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

  it('removes a UI extension', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtension);
      result.current.addUiExtension({
        ...uiExtension,
        location: 'Sidebar:Toolbar:Above',
      });
      result.current.removeUiExtension(
        uiExtension.location,
        uiExtension.element,
      );
    });

    expect(result.current.uiExtensions.length).toBe(1);
  });

  it('removes all UI extensions for a source at a location', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtension);
      result.current.addUiExtension(uiExtension2);
      result.current.addUiExtension(uiExtension3);
      result.current.removeAllUiExtensions(
        'extension-id',
        'Sidebar:Toolbar:Item',
      );
    });

    expect(result.current.uiExtensions.length).toBe(2);
  });

  it('removes all UI extensions for a source', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addUiExtension(uiExtension);
      result.current.addUiExtension(uiExtension2);
      result.current.addUiExtension(uiExtension3);
      result.current.removeAllUiExtensions('extension-id');
    });

    expect(result.current.uiExtensions.length).toBe(1);
  });
});
