import { renderHook, act, textFile } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './files-extension';
import { generateFileReference } from '../generateFileReference';
import { useAllFileReferences } from '../useAllFileReferences';
import { Files } from '../Files';

let core = initializeCore('files');

describe('files extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        Files.clear(core);
      });
      core = initializeCore('files');
    });

    describe('filleReferences resource registration', () => {
      it('loads filleReferences', async () => {
        const { result } = renderHook(() => useAllFileReferences());
        const filleReference = await generateFileReference(textFile);

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onLoad([filleReference]);
        });

        expect(result.current[filleReference.id]).toBeDefined();
      });

      it('handles added/updated filleReferences', async () => {
        const { result } = renderHook(() => useAllFileReferences());
        const filleReference = await generateFileReference(textFile);

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onChange(filleReference, false);
        });

        expect(result.current[filleReference.id]).toBeDefined();
      });

      it('handles deleted filleReferences', async () => {
        const { result } = renderHook(() => useAllFileReferences());
        const filleReference = await generateFileReference(textFile);

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onLoad([filleReference]);
          connector.onChange(filleReference, true);
        });

        expect(result.current[filleReference.id]).not.toBeDefined();
      });
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

    it('removes event listeners', () => {
      onRun(core);
      Files.addEventListener(core, 'files:create', jest.fn());

      act(() => {
        onDisable(core);
        expect(core.hasEventListeners()).toBe(false);
      });
    });
  });
});
