import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './tags-extension';
import { generateTag } from '../generateTag';
import { useAllTags } from '../useAllTags';
import { Tags } from '../Tags';

const core = initializeCore({ appId: 'app-id', extensionId: 'tags' });

describe('tags extension', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    act(() => {
      Tags.clear(core);
    });
  });

  describe('onRun', () => {
    describe('tags resource registration', () => {
      it('loads tags', () => {
        const { result } = renderHook(() => useAllTags());
        const tag = generateTag({ label: 'Tag' });

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onLoad([tag]);
        });

        expect(result.current[tag.id]).toBeDefined();
      });

      it('handles added/updated tags', () => {
        const { result } = renderHook(() => useAllTags());
        const tag = generateTag({ label: 'Tag' });

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onChange(tag, false);
        });

        expect(result.current[tag.id]).toBeDefined();
      });

      it('handles deleted tags', () => {
        const { result } = renderHook(() => useAllTags());
        const tag = generateTag({ label: 'Tag' });

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onLoad([tag]);
          connector.onChange(tag, true);
        });

        expect(result.current[tag.id]).not.toBeDefined();
      });
    });
  });

  describe('onDisable', () => {
    it('clears the store', () => {
      const { result } = renderHook(() => useAllTags());
      const tag1 = generateTag({ label: 'Book' });
      const tag2 = generateTag({ label: 'Link' });

      onRun(core);

      act(() => {
        core.dispatch('tags:load', [tag1, tag2]);
        onDisable(core);
      });

      expect(result.current[tag1.id]).not.toBeDefined();
      expect(result.current[tag2.id]).not.toBeDefined();
    });

    it('removes event listeners', () => {
      const { result } = renderHook(() => useAllTags());
      const tag1 = generateTag({ label: 'Book' });
      const tag2 = generateTag({ label: 'Link' });

      onRun(core);

      act(() => {
        onDisable(core);
        core.dispatch('tags:load', [tag1, tag2]);
      });

      expect(result.current[tag1.id]).not.toBeDefined();
      expect(result.current[tag2.id]).not.toBeDefined();
    });
  });
});
