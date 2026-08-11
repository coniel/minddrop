import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AutomationNotFoundError } from '../errors';
import { automation_1, cleanup, setup } from '../test-utils';
import { getAutomation } from './getAutomation';

describe('getAutomation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the automation', () => {
    expect(getAutomation(automation_1.id)).toEqual(automation_1);
  });

  it('throws if the automation does not exist', () => {
    expect(() => getAutomation('missing')).toThrow(AutomationNotFoundError);
  });

  it('returns null for a missing automation when specified', () => {
    expect(getAutomation('missing', false)).toBeNull();
  });
});
