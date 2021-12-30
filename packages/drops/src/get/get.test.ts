import { initializeCore } from '@minddrop/core';
import { act, renderHook } from '@minddrop/test-utils';
import { get } from './get';
import { onDisable, onRun } from '../drops-extension';
import { archiveDrop } from '../archiveDrop';
import { deleteDrop } from '../deleteDrop';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

// Set up extension
onRun(core);

describe('get', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
    onRun(core);
  });

  describe('given an array of IDs', () => {
    it('returns drop map', () => {
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });

      act(() => {
        loadDrops(core, [drop1, drop2]);
      });

      const drops = get([drop1.id, drop2.id]);

      expect(Object.keys(drops).length).toBe(2);
      expect(drops[drop1.id]).toEqual(drop1);
      expect(drops[drop2.id]).toEqual(drop2);
    });

    it('filters drops', () => {
      const drop1 = generateDrop({ type: 'text' });
      const drop2 = generateDrop({ type: 'text' });
      let drop3 = generateDrop({ type: 'text' });

      act(() => {
        loadDrops(core, [drop1, drop2, drop3]);
        archiveDrop(core, drop2.id);
        drop3 = deleteDrop(core, drop3.id);
      });

      const { result } = renderHook(() =>
        get([drop1.id, drop2.id, drop3.id], { deleted: true }),
      );

      expect(result.current[drop1.id]).not.toBeDefined();
      expect(result.current[drop2.id]).not.toBeDefined();
      expect(result.current[drop3.id]).toEqual(drop3);
    });
  });

  describe('given a single ID', () => {
    it('returns a single drop', () => {
      const drop = generateDrop({ type: 'text' });

      act(() => {
        loadDrops(core, [drop]);
      });

      expect(get(drop.id)).toBe(drop);
    });

    it('throws an error if using filters', () => {
      const drop = generateDrop({ type: 'text' });

      act(() => {
        loadDrops(core, [drop]);
      });

      // @ts-ignore
      expect(() => get(drop.id, { deleted: true })).toThrowError();
    });
  });
});
