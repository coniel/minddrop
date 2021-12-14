import { act, renderHook, textFile } from '@minddrop/test-utils';
import { getFileReference } from './getFileReference';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { generateFileReference } from '../generateFileReference';
import { FileReferenceNotFoundError } from '../errors';

describe('getFileReference', () => {
  afterEach(() => {
    const { result } = renderHook(() => useFileReferencesStore());

    act(() => {
      result.current.clear();
    });
  });

  it('returns the file matching the id', async () => {
    const { result } = renderHook(() => useFileReferencesStore());

    const file = await generateFileReference(textFile);

    act(() => {
      result.current.setFileReference(file);
    });

    expect(getFileReference(file.id)).toBe(file);
  });

  it('throws a FileReferenceNotFoundError if the file does not exist', () => {
    expect(() => getFileReference('id')).toThrowError(
      FileReferenceNotFoundError,
    );
  });
});
