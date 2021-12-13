import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './tags-extension';
import { generateTag } from '../generateTag';
import { useAllTags } from '../useAllTags';

let core = initializeCore('tags');

describe('tags extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        core.dispatch('tags:clear');
      });
      core = initializeCore('tags');
    });

    it("reacts to 'tags:load' events by loading the tags into the store", () => {
      const { result } = renderHook(() => useAllTags());
      const tag1 = generateTag({ label: 'Book' });
      const tag2 = generateTag({ label: 'Link' });

      onRun(core);

      act(() => {
        core.dispatch('tags:load', [tag1, tag2]);
      });

      expect(result.current[tag1.id]).toBeDefined();
      expect(result.current[tag2.id]).toBeDefined();
    });

    it("reacts to 'tags:clear' events by clearing the tags store", () => {
      const { result } = renderHook(() => useAllTags());
      const tag1 = generateTag({ label: 'Book' });
      const tag2 = generateTag({ label: 'Link' });

      onRun(core);

      act(() => {
        core.dispatch('tags:load', [tag1, tag2]);
        core.dispatch('tags:clear');
      });

      expect(result.current[tag1.id]).not.toBeDefined();
      expect(result.current[tag2.id]).not.toBeDefined();
    });

    it("reacts to 'tags:create' events by adding the new tag to the store", () => {
      const { result } = renderHook(() => useAllTags());
      const tag = generateTag({ label: 'Book' });

      onRun(core);

      act(() => {
        core.dispatch('tags:create', tag);
      });

      expect(result.current[tag.id]).toBeDefined();
    });

    it("reacts to 'tags:update' events by updating the tag in the store", () => {
      const { result } = renderHook(() => useAllTags());
      const tag = generateTag({ label: 'Book' });

      onRun(core);

      act(() => {
        core.dispatch('tags:create', tag);
        core.dispatch('tags:update', {
          before: tag,
          after: {
            ...tag,
            label: 'Updated title',
          },
          changes: { label: 'Updated title' },
        });
      });

      expect(result.current[tag.id].label).toBe('Updated title');
    });

    it("reacts to 'tags:delete' events by removing the tag from the store", () => {
      const { result } = renderHook(() => useAllTags());
      const tag = generateTag({ label: 'Book' });

      onRun(core);

      act(() => {
        core.dispatch('tags:create', tag);
        core.dispatch('tags:delete', tag);
      });

      expect(result.current[tag.id]).not.toBeDefined();
    });

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
    afterEach(() => {
      act(() => {
        core.dispatch('tags:clear');
      });
      core = initializeCore('tags');
    });

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
