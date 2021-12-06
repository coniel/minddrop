import { FieldValue } from '../../FieldValue';
import { applyFieldValueArrayUnion } from './applyFieldValueArrayUnion';

describe('applyFieldValueArrayUnion', () => {
  it('merges values into array', () => {
    const object = { field: [0, 1, 2] };
    const changes = { field: FieldValue.arrayUnion(3, 4) };
    const result = applyFieldValueArrayUnion(object, changes);

    expect(result.field.length).toBe(5);
    expect(result.field[3]).toBe(3);
    expect(result.field[4]).toBe(4);
  });

  it('creates the field if it does not exist', () => {
    const object: { field?: number[] } = {};
    const changes = { field: FieldValue.arrayUnion(3, 4) };
    const result = applyFieldValueArrayUnion(object, changes);

    expect(result.field.length).toBe(2);
    expect(result.field[0]).toBe(3);
    expect(result.field[1]).toBe(4);
  });
});
