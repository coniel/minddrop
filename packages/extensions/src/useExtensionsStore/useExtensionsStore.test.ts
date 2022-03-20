import { renderHook, act } from '@minddrop/test-utils';
import {
  appExtensionConfig,
  appExtensionDocument,
  topicExtensionConfig,
  topicExtensionDocument,
} from '../test-utils';
import { useExtensionsStore } from './useExtensionsStore';

describe('useExtensionsStore', () => {
  afterEach(() => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));
    act(() => {
      result.current.clear();
    });
  });

  it('sets a extension config', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtensionConfig(topicExtensionConfig);
    });

    expect(result.current.extensionConfigs[topicExtensionConfig.id]).toEqual(
      topicExtensionConfig,
    );
  });

  it('removes a extension config', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtensionConfig(topicExtensionConfig);
      result.current.removeExtensionConfig(topicExtensionConfig.id);
    });

    expect(
      result.current.extensionConfigs[topicExtensionConfig.id],
    ).not.toBeDefined();
  });

  it('loads extension documents', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.loadExtensionDocuments([
        topicExtensionDocument,
        appExtensionDocument,
      ]);
    });

    const docs = result.current.extensionDocuments;

    expect(docs[topicExtensionConfig.id]).toEqual(topicExtensionDocument);
    expect(docs[appExtensionConfig.id]).toEqual(appExtensionDocument);
  });

  it('sets a extension document', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtensionDocument(topicExtensionDocument);
    });

    expect(result.current.extensionDocuments[topicExtensionConfig.id]).toEqual(
      topicExtensionDocument,
    );
  });

  it('removes a extension document', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      result.current.setExtensionDocument(topicExtensionDocument);
      result.current.removeExtensionDocument(topicExtensionConfig.id);
    });

    expect(
      result.current.extensionDocuments[topicExtensionConfig.id],
    ).not.toBeDefined();
  });

  it('clears store data', () => {
    const { result } = renderHook(() => useExtensionsStore((state) => state));

    act(() => {
      // Add an extension config
      result.current.setExtensionConfig(topicExtensionConfig);
      // Add an extension document
      result.current.setExtensionDocument(topicExtensionDocument);
      // Clear the store
      result.current.clear();
    });

    // Should no longer contain extesion configs
    expect(result.current.extensionConfigs).toEqual({});
    // Should no longer contain extension documents
    expect(result.current.extensionDocuments).toEqual({});
  });
});
