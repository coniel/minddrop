import { describe, expect, it } from 'vitest';
import { createHistoryAction } from './createHistoryAction';

describe('createHistoryAction', () => {
  it('creates an action with an ID', () => {
    expect(createHistoryAction('databases:property-removed').id).toMatch(
      /^action_[0-9a-f-]{36}$/,
    );
  });

  it('returns the cause', () => {
    expect(createHistoryAction('databases:property-removed').cause).toBe(
      'databases:property-removed',
    );
  });

  it('creates a distinct ID for each action', () => {
    expect(createHistoryAction('tags:tag-renamed').id).not.toBe(
      createHistoryAction('tags:tag-renamed').id,
    );
  });
});
