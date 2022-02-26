import { renderHook, act } from '@minddrop/test-utils';
import { VIEWS_TEST_DATA } from '@minddrop/views';
import { UiExtensionConfig } from '../types';
import { useAppStore } from './useAppStore';

const { viewInstance1 } = VIEWS_TEST_DATA;

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

  it('adds root topics', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addRootTopics(['topic-1', 'topic-2']);
    });

    expect(result.current.rootTopics).toEqual(['topic-1', 'topic-2']);
  });

  it('removes root topics', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addRootTopics(['topic-1', 'topic-2', 'topic-3']);
      result.current.removeRootTopics(['topic-1', 'topic-2']);
    });

    expect(result.current.rootTopics).toEqual(['topic-3']);
  });

  it('sets the view', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.setView('my-view');
    });

    expect(result.current.view).toBe('my-view');
  });

  it('sets the view instance', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.setViewInstance(viewInstance1);
    });

    expect(result.current.viewInstance).toBe(viewInstance1);
  });

  it('clears the state', () => {
    const { result } = renderHook(() => useAppStore((state) => state));

    act(() => {
      result.current.addRootTopics(['topic-id']);
      result.current.addUiExtension(uiExtension);
      result.current.addUiExtension(uiExtension);
      result.current.addSelectedDrops(['drop-id']);
      result.current.addSelectedDrops(['topic-id']);
      result.current.setView('some-view');
      result.current.setViewInstance(viewInstance1);
      result.current.setDraggedData({
        drops: ['drop-id'],
        topics: ['topic-id'],
      });
      result.current.clear();
    });

    expect(result.current.rootTopics.length).toBe(0);
    expect(result.current.uiExtensions.length).toBe(0);
    expect(result.current.selectedDrops.length).toBe(0);
    expect(result.current.selectedTopics.length).toBe(0);
    expect(result.current.view).toBe('app:home');
    expect(result.current.viewInstance).toBeNull();
    expect(result.current.draggedData).toEqual({ drops: [], topics: [] });
  });

  describe('UI extensions', () => {
    it('add a UI extension', () => {
      const { result } = renderHook(() => useAppStore((state) => state));

      act(() => {
        result.current.addUiExtension(uiExtension);
      });

      expect(result.current.uiExtensions.length).toBe(1);
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

  describe('selected drops', () => {
    it('adds selected drops', () => {
      useAppStore.getState().addSelectedDrops(['drop-id']);

      expect(useAppStore.getState().selectedDrops).toEqual(['drop-id']);
    });

    it('removes selected drops', () => {
      useAppStore.getState().addSelectedDrops(['drop-id', 'drop2-id']);
      useAppStore.getState().removeSelectedDrops(['drop-id']);

      expect(useAppStore.getState().selectedDrops).toEqual(['drop2-id']);
    });

    it('clears selected drops', () => {
      useAppStore.getState().addSelectedDrops(['drop-id', 'drop2-id']);
      useAppStore.getState().clearSelectedDrops();

      expect(useAppStore.getState().selectedDrops).toEqual([]);
    });
  });

  describe('selected topics', () => {
    it('adds selected topics', () => {
      useAppStore.getState().addSelectedTopics(['topic-id']);

      expect(useAppStore.getState().selectedTopics).toEqual(['topic-id']);
    });

    it('removes selected topics', () => {
      useAppStore.getState().addSelectedTopics(['topic-id', 'topic2-id']);
      useAppStore.getState().removeSelectedTopics(['topic-id']);

      expect(useAppStore.getState().selectedTopics).toEqual(['topic2-id']);
    });

    it('clears selected topics', () => {
      useAppStore.getState().addSelectedTopics(['topic-id', 'topic2-id']);
      useAppStore.getState().clearSelectedTopics();

      expect(useAppStore.getState().selectedTopics).toEqual([]);
    });
  });

  describe('clearSelection', () => {
    it('clears selected drops and topics', () => {
      const store = useAppStore.getState();
      store.addSelectedDrops(['drop-1']);
      store.addSelectedTopics(['topic-1']);

      store.clearSelection();

      expect(useAppStore.getState().selectedDrops).toEqual([]);
      expect(useAppStore.getState().selectedTopics).toEqual([]);
    });
  });

  describe('dragged data', () => {
    it('sets dragged drops', () => {
      // Set dragged drops
      useAppStore.getState().setDraggedData({ drops: ['drop-id'] });

      // Should be set in store
      expect(useAppStore.getState().draggedData).toEqual({
        drops: ['drop-id'],
        topics: [],
      });
    });

    it('sets dragged topics', () => {
      // Set dragged topics
      useAppStore.getState().setDraggedData({ topics: ['topic-id'] });

      // Should be set in store
      expect(useAppStore.getState().draggedData).toEqual({
        drops: [],
        topics: ['topic-id'],
      });
    });

    it('clears dragged data', () => {
      // Set dragged data
      useAppStore
        .getState()
        .setDraggedData({ drops: ['drop-id'], topics: ['topic-id'] });
      // Clear dragged data
      useAppStore.getState().clearDraggedData();

      // Store should be cleared
      expect(useAppStore.getState().draggedData).toEqual({
        drops: [],
        topics: [],
      });
    });
  });
});
