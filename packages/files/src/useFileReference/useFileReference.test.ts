import { renderHook, act, textFile } from '@minddrop/test-utils';
import { generateFileReference } from '../generateFileReference';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { useFileReference } from './useFileReference';

describe('useFileReference', () => {
  it('returns a file by id', async () => {
    const { result: store } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const file3 = await generateFileReference(textFile);
    const { result } = renderHook(() => useFileReference(file1.id));

    act(() => {
      store.current.loadFileReferences([file1, file2, file3]);
    });

    expect(result.current).toEqual(file1);
  });

  it('returns null if file does not exist', async () => {
    const { result: store } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const { result } = renderHook(() => useFileReference('file-id'));
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);

    act(() => {
      store.current.loadFileReferences([file1, file2]);
    });

    expect(result.current).toBeNull();
  });
});
