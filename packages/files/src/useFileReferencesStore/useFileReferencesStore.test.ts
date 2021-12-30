import {
  renderHook,
  act,
  MockDate,
  textFile,
  imageFile,
} from '@minddrop/test-utils';
import { generateFileReference } from '../generateFileReference';
import { useFileReferencesStore } from './useFileReferencesStore';

describe('useFileReferenceStore', () => {
  afterEach(() => {
    MockDate.reset();
    const { result } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    act(() => {
      result.current.clear();
    });
  });

  it('loads in files', async () => {
    const { result } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(imageFile);

    act(() => {
      result.current.loadFileReferences([file1, file2]);
    });

    expect(Object.keys(result.current.files).length).toBe(2);
  });

  it('clears the store', async () => {
    const { result } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(imageFile);

    act(() => {
      result.current.loadFileReferences([file1, file2]);
      result.current.clear();
    });

    expect(Object.keys(result.current.files).length).toBe(0);
  });

  it('adds a file', async () => {
    const { result } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );
    const file = await generateFileReference(textFile);

    act(() => {
      result.current.setFileReference(file);
    });

    expect(Object.keys(result.current.files).length).toBe(1);
  });

  it('removes a file', async () => {
    const file1 = await generateFileReference(textFile);
    const file2 = await generateFileReference(imageFile);
    const { result } = renderHook(() =>
      useFileReferencesStore((state) => state),
    );

    act(() => {
      result.current.loadFileReferences([file1, file2]);
      result.current.removeFileReference(file1.id);
    });

    expect(Object.keys(result.current.files).length).toBe(1);
  });
});
