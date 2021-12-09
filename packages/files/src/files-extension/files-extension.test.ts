import { renderHook, act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './files-extension';
import { generateFileReference } from '../generateFileReference';
import { useAllFileReferences } from '../useAllFileReferences';
import { Files } from '../Files';
import { FileReference } from '../types';

let core = initializeCore('files');

describe('files extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        Files.clear(core);
      });
      core = initializeCore('files');
    });

    it("reacts to 'files:load' events by loading the files into the store", async () => {
      const { result } = renderHook(() => useAllFileReferences());
      const file1 = await generateFileReference(textFile);
      const file2 = await generateFileReference(textFile);

      onRun(core);

      act(() => {
        Files.load(core, [file1, file2]);
      });

      expect(result.current[file1.id]).toBeDefined();
      expect(result.current[file2.id]).toBeDefined();
    });

    it("reacts to 'files:clear' events by clearing the files store", async () => {
      const { result } = renderHook(() => useAllFileReferences());
      const file1 = await generateFileReference(textFile);
      const file2 = await generateFileReference(textFile);

      onRun(core);

      act(() => {
        Files.load(core, [file1, file2]);
        Files.clear(core);
      });

      expect(result.current[file1.id]).not.toBeDefined();
      expect(result.current[file2.id]).not.toBeDefined();
    });

    it("reacts to 'files:create' events by adding the new file to the store", async () => {
      const { result } = renderHook(() => useAllFileReferences());
      let ref: FileReference;

      onRun(core);

      await act(async () => {
        ref = await Files.create(core, textFile);
      });

      expect(result.current[ref.id]).toBeDefined();
    });

    it("reacts to 'files:delete' events by removing the file from the store", async () => {
      const { result } = renderHook(() => useAllFileReferences());
      let ref: FileReference;

      onRun(core);

      await act(async () => {
        ref = await Files.create(core, textFile);
        Files.create(core, textFile);
        Files.delete(core, ref.id);
      });

      expect(result.current[ref.id]).not.toBeDefined();
    });
  });

  describe('onDisable', () => {
    afterEach(() => {
      act(() => {
        Files.clear(core);
      });
      core = initializeCore('files');
    });

    it('clears the store', async () => {
      const { result } = renderHook(() => useAllFileReferences());
      const file1 = await generateFileReference(textFile);
      const file2 = await generateFileReference(textFile);

      onRun(core);

      act(() => {
        Files.load(core, [file1, file2]);
        onDisable(core);
      });

      expect(result.current[file1.id]).not.toBeDefined();
      expect(result.current[file2.id]).not.toBeDefined();
    });

    it('removes event listeners', async () => {
      const { result } = renderHook(() => useAllFileReferences());
      const file1 = await generateFileReference(textFile);
      const file2 = await generateFileReference(textFile);

      onRun(core);

      act(() => {
        onDisable(core);
        Files.load(core, [file1, file2]);
      });

      expect(result.current[file1.id]).not.toBeDefined();
      expect(result.current[file2.id]).not.toBeDefined();
    });
  });
});
