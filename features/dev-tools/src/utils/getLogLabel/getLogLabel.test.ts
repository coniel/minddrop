import { describe, expect, it } from 'vitest';
import { DevToolsFixtures } from '../../test-utils';
import { getLogLabel } from './getLogLabel';

const { messageLogEntry, labelledLogEntry } = DevToolsFixtures;

describe('getLogLabel', () => {
  it('returns the leading string of a multi value call', () => {
    expect(getLogLabel(labelledLogEntry)).toBe('Databases');
  });

  it('returns null when the call has a single value', () => {
    expect(getLogLabel(messageLogEntry)).toBeNull();
  });

  it('returns null when the leading value is not a string', () => {
    expect(
      getLogLabel({ ...labelledLogEntry, args: [{ count: 2 }, 'Databases'] }),
    ).toBeNull();
  });
});
