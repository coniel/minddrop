import { FieldValue } from '../../FieldValue';
import { applyFieldValueObjectUnion } from './applyFieldValueObjectUnion';

describe('applyFieldValueArrayUnion', () => {
  it('merges values into object', () => {
    const object = {
      field: {
        foo: 'bar',
        bar: 'foo',
        arrayField: [1],
        objectField: { nestedFoo: 'bar' },
      },
      nullField: null,
    };
    const changes = {
      field: FieldValue.objectUnion({
        foo: 'foo',
        bar: FieldValue.delete(),
        arrayField: FieldValue.arrayUnion([2]),
        objectField: FieldValue.objectUnion({ nestedFoo: 'foo' }),
      }),
      nullField: null,
    };
    const result = applyFieldValueObjectUnion(object, changes);

    expect(result.field).toEqual({
      foo: 'foo',
      arrayField: [1, 2],
      objectField: { nestedFoo: 'foo' },
    });
    expect(result.nullField).toBeNull();
  });

  it('creates the field if it does not exist', () => {
    const object: { field?: object } = {};
    const changes = {
      field: FieldValue.objectUnion({
        foo: 'foo',
        arrayField: FieldValue.arrayUnion([1]),
        objectField: FieldValue.objectUnion({ nestedFoo: 'foo' }),
      }),
    };
    const result = applyFieldValueObjectUnion(object, changes);

    expect(result.field).toEqual({
      foo: 'foo',
      arrayField: [1],
      objectField: { nestedFoo: 'foo' },
    });
  });
});
