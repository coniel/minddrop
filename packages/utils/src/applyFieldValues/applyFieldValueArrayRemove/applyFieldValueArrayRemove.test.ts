import { FieldValue } from '../../FieldValue';
import { applyFieldValueArrayRemove } from './applyFieldValueArrayRemove';

describe('applyFieldValueArrayRemove', () => {
  it('removes values from array', () => {
    const object = { field: [0, 1, 2, 3, 4] };
    const changes = { field: FieldValue.arrayRemove([2, 4, 5]) };
    const result = applyFieldValueArrayRemove(object, changes);

    expect(result.field).toEqual([0, 1, 3]);
  });

  it('supports individual values', () => {
    const object = { field: [0, 1, 2, 3, 4] };
    const changes = { field: FieldValue.arrayRemove(2) };
    const result = applyFieldValueArrayRemove(object, changes);

    expect(result.field).toEqual([0, 1, 3, 4]);
  });

  it('does nothing if field does not exist', () => {
    const object: { field?: number[] } = {};
    const changes = { field: FieldValue.arrayRemove([1, 2]) };
    const result = applyFieldValueArrayRemove(object, changes);

    expect(result.field).not.toBeDefined();
  });
});
