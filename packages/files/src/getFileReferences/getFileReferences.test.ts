import { act, renderHook, textFile } from '@minddrop/test-utils';
import { getFileReferences } from './getFileReferences';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { generateFileReference } from '../generateFileReference';
import { FileReferenceNotFoundError } from '../errors';

describe('getFileReferences', () => {
  afterEach(() => {
    const { result } = renderHook(() => useFileReferencesStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns the files matching the ids', async () => {
    const { result } = renderHook(() => useFileReferencesStore());

    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(textFile);
    const file3 = await generateFileReference(textFile);

    act(() => {
      result.current.addFileReference(file1);
      result.current.addFileReference(file2);
      result.current.addFileReference(file3);
    });

    const files = getFileReferences([file1.id, file2.id]);

    expect(Object.keys(files).length).toBe(2);
    expect(files[file1.id]).toEqual(file1);
    expect(files[file2.id]).toEqual(file2);
  });

  it('throws a FileReferenceNotFoundError if the file does not exist', () => {
    expect(() => getFileReferences(['id'])).toThrowError(
      FileReferenceNotFoundError,
    );
  });
});
