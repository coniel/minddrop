import { FieldValue } from '../../FieldValue';
import { applyFieldValueArrayUnion } from './applyFieldValueArrayUnion';

describe('applyFieldValueArrayUnion', () => {
  it('merges values into array', () => {
    const object = { field: [0, 1, 2] };
    const changes = { field: FieldValue.arrayUnion([3, 4]) };
    const result = applyFieldValueArrayUnion(object, changes);

    expect(result.field).toEqual([0, 1, 2, 3, 4]);
  });

  it('supports single values', () => {
    const object = { field: [0, 1, 2] };
    const changes = { field: FieldValue.arrayUnion(3) };
    const result = applyFieldValueArrayUnion(object, changes);

    expect(result.field).toEqual([0, 1, 2, 3]);
  });

  it('creates the field if it does not exist', () => {
    const object: { field?: number[] } = {};
    const changes = { field: FieldValue.arrayUnion([3, 4]) };
    const result = applyFieldValueArrayUnion(object, changes);

    expect(result.field).toEqual([3, 4]);
  });
});
