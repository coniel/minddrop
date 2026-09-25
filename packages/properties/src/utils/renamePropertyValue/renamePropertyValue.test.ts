import { describe, expect, it } from 'vitest';
import { renamePropertyValue } from './renamePropertyValue';

describe('renamePropertyValue', () => {
  it('renames a single value which is the member', () => {
    expect(renamePropertyValue('Todo', 'Todo', 'Doing')).toBe('Doing');
  });

  it('leaves a single value which is not the member as it is', () => {
    expect(renamePropertyValue('Done', 'Todo', 'Doing')).toBe('Done');
  });

  it('renames the member in a list and keeps the other members', () => {
    expect(renamePropertyValue(['Home', 'Work'], 'Home', 'House')).toEqual([
      'House',
      'Work',
    ]);
  });

  it('dedupes when the new name is already in the list', () => {
    expect(renamePropertyValue(['Urgent', 'Later'], 'Urgent', 'Later')).toEqual(
      ['Later'],
    );
  });

  it('leaves a list which does not contain the member as it is', () => {
    const value = ['Home', 'Work'];

    expect(renamePropertyValue(value, 'Urgent', 'Later')).toBe(value);
  });

  it('leaves other values as they are', () => {
    expect(renamePropertyValue(null, 'Todo', 'Doing')).toBeNull();
    expect(renamePropertyValue(true, 'Todo', 'Doing')).toBe(true);
  });
});
