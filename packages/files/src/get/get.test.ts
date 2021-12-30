import { act, renderHook, textFile } from '@minddrop/test-utils';
import { get } from './get';
import { useFileReferencesStore } from '../useFileReferencesStore';
import { generateFileReference } from '../generateFileReference';

describe('get', () => {
  afterEach(() => {
    const { result } = renderHook(() => useFileReferencesStore());

    act(() => {
      result.current.clear();
    });
  });

  describe('given an array of IDs', () => {
    it('returns file map', async () => {
      const { result } = renderHook(() => useFileReferencesStore());

      const file1 = await generateFileReference(textFile);
      const file2 = await generateFileReference(textFile);
      const file3 = await generateFileReference(textFile);

      act(() => {
        result.current.setFileReference(file1);
        result.current.setFileReference(file2);
        result.current.setFileReference(file3);
      });

      const files = get([file1.id, file2.id]);

      expect(Object.keys(files).length).toBe(2);
      expect(files[file1.id]).toEqual(file1);
      expect(files[file2.id]).toEqual(file2);
    });
  });

  describe('given a single ID', () => {
    it('returns a single file', async () => {
      const { result } = renderHook(() => useFileReferencesStore());

      const file = await generateFileReference(textFile);

      act(() => {
        result.current.setFileReference(file);
      });

      expect(get(file.id)).toBe(file);
    });
  });
});
