import { renderHook, act, textFile } from '@minddrop/test-utils';
import { generateFileReference } from '../generateFileReference';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { useAllFileReferences } from './useAllFileReferences';

describe('useAllFileReferences', () => {
  it('returns all files', async () => {
    const { result: store } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const file3 = await generateFileReference(textFile);
    const { result } = renderHook(() => useAllFileReferences());

    act(() => {
      store.current.loadFileReferences([file1, file2, file3]);
    });

    expect(result.current[file1.id]).toEqual(file1);
    expect(result.current[file2.id]).toEqual(file2);
    expect(result.current[file3.id]).toEqual(file3);
  });
});
