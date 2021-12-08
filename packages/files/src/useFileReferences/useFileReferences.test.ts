import { renderHook, act, textFile } from '@minddrop/test-utils';
import { generateFileReference } from '../generateFileReference';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { useFileReferences } from './useFileReferences';

describe('useFileReferences', () => {
  it('returns files by id', async () => {
    const { result: store } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const file3 = await generateFileReference(textFile);
    const { result } = renderHook(() =>
      useFileReferences([file1.id, file2.id]),
    );

    act(() => {
      store.current.loadFileReferences([file1, file2, file3]);
    });

    expect(result.current[file1.id]).toEqual(file1);
    expect(result.current[file2.id]).toEqual(file2);
    expect(result.current[file3.id]).not.toBeDefined();
  });

  it('ignores non existant files', async () => {
    const { result: store } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const { result } = renderHook(() =>
      useFileReferences([file1.id, 'missing-file']),
    );

    act(() => {
      store.current.loadFileReferences([file1, file2]);
    });

    expect(result.current['missing-file']).not.toBeDefined();
    expect(Object.keys(result.current).length).toBe(1);
  });
});
