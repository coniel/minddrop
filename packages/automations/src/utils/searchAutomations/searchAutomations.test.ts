import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { automation_1, automation_2, cleanup, setup } from '../../test-utils';
import { searchAutomations } from './searchAutomations';

describe('searchAutomations', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches automations by name', () => {
    expect(searchAutomations(automation_2.name)).toEqual([automation_2]);
  });

  it('returns no results when nothing matches', () => {
    expect(searchAutomations('zzzz')).toEqual([]);
  });

  it('matches partial names', () => {
    expect(searchAutomations('Automation')).toContainEqual(automation_1);
  });
});
