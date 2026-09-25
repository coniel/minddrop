import { describe, expect, it } from 'vitest';
import { removePropertyValue } from './removePropertyValue';

describe('removePropertyValue', () => {
  it('removes the member from a list', () => {
    expect(removePropertyValue(['Urgent', 'Home'], 'Urgent')).toEqual(['Home']);
  });

  it('leaves a list without the member as it is', () => {
    expect(removePropertyValue(['Home'], 'Urgent')).toEqual(['Home']);
  });

  it('leaves other values as they are', () => {
    expect(removePropertyValue('Urgent', 'Urgent')).toBe('Urgent');
    expect(removePropertyValue(null, 'Urgent')).toBeNull();
  });
});
