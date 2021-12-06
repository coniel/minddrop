import { FieldValue } from '../../FieldValue';
import { applyFieldValueArrayRemove } from './applyFieldValueArrayRemove';

describe('applyFieldValueArrayRemove', () => {
  it('removes values from array', () => {
    const object = { field: [0, 1, 2, 3, 4] };
    const changes = { field: FieldValue.arrayRemove(2, 4, 5) };
    const result = applyFieldValueArrayRemove(object, changes);

    expect(result.field.length).toBe(3);
    expect(result.field[0]).toBe(0);
    expect(result.field[1]).toBe(1);
    expect(result.field[2]).toBe(3);
  });

  it('does nothing if field does not exist', () => {
    const object: { field?: number[] } = {};
    const changes = { field: FieldValue.arrayRemove(1, 2) };
    const result = applyFieldValueArrayRemove(object, changes);

    expect(result.field).not.toBeDefined();
  });
});
