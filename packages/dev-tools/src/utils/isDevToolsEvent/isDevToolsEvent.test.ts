import { describe, expect, it } from 'vitest';
import { DevToolsNamespace } from '../../constants';
import { isDevToolsEvent } from './isDevToolsEvent';

describe('isDevToolsEvent', () => {
  it('returns true for events of the dev tools own stores', () => {
    expect(
      isDevToolsEvent({
        namespace: DevToolsNamespace,
        persistTo: 'app-config',
      }),
    ).toBe(true);
  });

  it('returns false for events of other stores', () => {
    expect(isDevToolsEvent({ namespace: 'app-ui' })).toBe(false);
  });

  it('returns false for events without a namespace', () => {
    expect(isDevToolsEvent({ id: 'db_1' })).toBe(false);
  });

  it('returns false for events without object data', () => {
    expect(isDevToolsEvent(undefined)).toBe(false);
    expect(isDevToolsEvent(null)).toBe(false);
    expect(isDevToolsEvent('dev-tools')).toBe(false);
  });
});
