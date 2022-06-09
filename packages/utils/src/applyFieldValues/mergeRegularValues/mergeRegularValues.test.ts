import { FieldValue } from '../../FieldValue';
import { mergeRegularValues } from './mergeRegularValues';

describe('mergeRegularValues', () => {
  it('merges in non FieldValue values', () => {
    const object = { field: 'value', nullField: 'foo' };
    const changes = { field: 'new value', nullField: null };
    const result = mergeRegularValues(object, changes);

    expect(result.field).toBe('new value');
    expect(result.nullField).toBeNull();
  });

  it('does not merge FieldValue values', () => {
    const object = { field: 'value', field2: [1, 2] };
    const changes = {
      field: FieldValue.delete(),
      field2: FieldValue.arrayUnion([3, 4]),
    };
    const result = mergeRegularValues(object, changes);

    expect(result.field).toBe('value');
    expect(result.field2).toEqual([1, 2]);
  });
});
