import { stringifySelectionItem } from './stringifySelectionItem';

describe('stringifySelectionItem', () => {
  it('stringifies items with a parent', () => {
    // Stringify a selection item which has a parent
    const string = stringifySelectionItem({
      resource: 'resource-type',
      id: 'resource-id',
      parent: { resource: 'parent-type', id: 'parent-id' },
    });

    // Should return a string in the format:
    // 'resource-type:resource-id:parent-type:parent-id'.
    expect(string).toBe('resource-type:resource-id:parent-type:parent-id');
  });

  it('stringifies items without a parent', () => {
    // Stringify a selection item which has a parent
    const string = stringifySelectionItem({
      resource: 'resource-type',
      id: 'resource-id',
    });

    // Should return a string in the format:
    // 'resource-type:resource-id'.
    expect(string).toBe('resource-type:resource-id');
  });
});
