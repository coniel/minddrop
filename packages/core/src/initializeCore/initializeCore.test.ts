import { describe, afterEach, it, expect, vi } from 'vitest';
import { initializeCore } from './initializeCore';

const core = initializeCore({ extensionId: 'app' });
const core2 = initializeCore({ extensionId: 'topics' });

describe('initializeCore', () => {
  afterEach(() => {
    core.removeAllEventListeners();
    core2.removeAllEventListeners();
  });

  it('adds event listeners', () => {
    const callback = vi.fn();

    core.addEventListener('test', callback);

    expect(core.hasEventListener('test', callback)).toBe(true);
  });

  it('dispatches events', () =>
    new Promise<void>((done) => {
      const data = 'foo';

      function callback(payload: any) {
        expect(payload.type).toBe('test');
        expect(payload.source).toBe('app');
        expect(payload.data).toBe(data);
        done();
      }

      core.addEventListener('test', callback);

      core.dispatch('test', data);
    }));

  it('removes a specified event listener', () => {
    const callback = vi.fn();
    const callback2 = vi.fn();

    core.addEventListener('test', callback);
    core.addEventListener('test-2', callback);
    core.addEventListener('test', callback2);

    core.removeEventListener('test', callback);

    expect(core.hasEventListener('test', callback)).toBe(false);
    expect(core.hasEventListener('test', callback2)).toBe(true);
    expect(core.hasEventListener('test-2', callback)).toBe(true);
  });

  it('removes all event listeners of a given type', () => {
    const callback = vi.fn();
    const callback2 = vi.fn();

    core.addEventListener('test', callback);
    core.addEventListener('test-2', callback);
    core.addEventListener('test', callback2);

    core.removeAllEventListeners('test');

    expect(core.hasEventListener('test', callback)).toBe(false);
    expect(core.hasEventListener('test', callback2)).toBe(false);
    expect(core.hasEventListener('test-2', callback)).toBe(true);
  });

  it("removes all of a source's event listeners", () => {
    const callback = vi.fn();
    const callback2 = vi.fn();

    core.addEventListener('test', callback);
    core.addEventListener('test-2', callback);
    core.addEventListener('test', callback2);
    core2.addEventListener('test', callback2);

    core.removeAllEventListeners();

    expect(core.hasEventListener('test', callback)).toBe(false);
    expect(core.hasEventListener('test', callback2)).toBe(false);
    expect(core.hasEventListener('test-2', callback)).toBe(false);
    expect(core2.hasEventListener('test', callback2)).toBe(true);
  });

  it('checks for a specific event listener', () => {
    const callback = vi.fn();

    core.addEventListener('test', callback);

    expect(core.hasEventListener('test', callback)).toBe(true);
    expect(core2.hasEventListener('test', callback)).toBe(false);
  });

  it("checks for a source's event listeners of a specific type", () => {
    const callback = vi.fn();

    core.addEventListener('test', callback);

    expect(core.hasEventListeners('test')).toBe(true);
    expect(core.hasEventListeners('test-2')).toBe(false);

    core.removeEventListener('test', callback);
    core2.addEventListener('test', callback);

    expect(core.hasEventListeners('test')).toBe(false);
  });

  it('checks for any event listeners added by a source', () => {
    const callback = vi.fn();

    core.addEventListener('test', callback);
    core.addEventListener('test-2', callback);

    expect(core.hasEventListeners()).toBe(true);
    expect(core2.hasEventListeners()).toBe(false);
  });

  it("counts a source's event listeners of a specific type", () => {
    const callback = vi.fn();
    const callback2 = vi.fn();

    core.addEventListener('test', callback);
    core.addEventListener('test', callback2);
    core2.addEventListener('test', callback);

    expect(core.eventListenerCount('test')).toBe(2);
    expect(core.eventListenerCount('test-2')).toBe(0);
  });

  it('counts all event listeners added by a source', () => {
    const callback = vi.fn();
    const callback2 = vi.fn();

    core.addEventListener('test', callback);
    core.addEventListener('test-2', callback);
    core2.addEventListener('test', callback2);

    expect(core.eventListenerCount()).toBe(2);
  });

  it('calls * event for all event types', () =>
    new Promise<void>((done) => {
      let calls = 0;

      function callback() {
        calls += 1;

        if (calls === 2) {
          done();
        }
      }

      core.addEventListener('*', callback);

      core.dispatch('test');
      core.dispatch('test-2');
    }));
});
