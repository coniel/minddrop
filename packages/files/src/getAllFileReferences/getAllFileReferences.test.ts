import { act, renderHook, textFile } from '@minddrop/test-utils';
import { getAllFileReferences } from './getAllFileReferences';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { generateFileReference } from '../generateFileReference';

describe('getAllFileReferences', () => {
  afterEach(() => {
    const { result } = renderHook(() => useFileReferencesStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns all files', async () => {
    const { result } = renderHook(() => useFileReferencesStore());

    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const file3 = await generateFileReference(textFile);

    act(() => {
      result.current.setFileReference(file1);
      result.current.setFileReference(file2);
      result.current.setFileReference(file3);
    });

    const files = getAllFileReferences();

    expect(Object.keys(files).length).toBe(3);
  });
});
