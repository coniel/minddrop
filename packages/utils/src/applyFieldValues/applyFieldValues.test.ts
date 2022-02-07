import { applyFieldValues } from './applyFieldValues';
import { FieldValue } from '../FieldValue';

describe('applyFieldValues', () => {
  it('merges in regular values', () => {
    const object = { field: 'value' };
    const changes = { field: 'new value' };
    const result = applyFieldValues(object, changes);

    expect(result.field).toBe('new value');
  });

  it('handles FieldValue.delete', () => {
    const object = { field: 'value' };
    const changes = { field: FieldValue.delete() };
    const result = applyFieldValues(object, changes);

    expect(result.field).not.toBeDefined();
  });

  it('handles FieldValue.objectUnion', () => {
    const object = { field: { foo: 'foo' } };
    const changes = { field: FieldValue.objectUnion({ foo: 'bar' }) };
    const result = applyFieldValues(object, changes);

    expect(result.field.foo).toBe('bar');
  });

  it('handles FieldValue.arrayUnion', () => {
    const object = { field: [0, 1, 2] };
    const changes = { field: FieldValue.arrayUnion([3, 4]) };
    const result = applyFieldValues(object, changes);

    expect(result.field.length).toBe(5);
  });

  it('handles FieldValue.arrayRemove', () => {
    const object = { field: [0, 1, 2, 3, 4] };
    const changes = { field: FieldValue.arrayRemove([2, 4]) };
    const result = applyFieldValues(object, changes);

    expect(result.field.length).toBe(3);
  });
});
