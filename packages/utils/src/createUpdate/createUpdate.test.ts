import { MockDate } from '@minddrop/test-utils';
import { FieldValue } from '../FieldValue';
import { createUpdate } from './createUpdate';

describe('createUpdate', () => {
  it('creates an update object with changes applied', () => {
    const object = {
      title: 'Title',
      optional: 'optional',
      array: [1, 2],
      array2: [1, 2],
    };
    const changes = {
      title: 'Updated title',
      optional: FieldValue.delete(),
      array: FieldValue.arrayUnion([3, 4]),
      array2: FieldValue.arrayRemove(2),
    };
    const result = createUpdate(object, changes);

    expect(result.changes).toEqual(changes);
    expect(result.after).toEqual({
      title: 'Updated title',
      array: [1, 2, 3, 4],
      array2: [1],
    });
    // Before should equal original object
    expect(result.before).toEqual(object);
  });

  it('sets updatedAt timestamp if requested', () => {
    MockDate.set('01/01/2000');
    const object = {
      updatedAt: new Date('01/01/1999'),
      title: 'Title',
    };
    const changes = {
      title: 'Updated title',
    };
    const result = createUpdate(object, changes, { setUpdatedAt: true });

    expect(result.changes).toEqual({ ...changes, updatedAt: new Date() });
    expect(result.after).toEqual({
      title: 'Updated title',
      updatedAt: new Date(),
    });

    MockDate.reset();
  });

  it('removes empty fields if specified in removeEmptyFields', () => {
    const object = {
      string1: 'string1',
      string2: 'string2',
      undef: 'undef',
      null: null,
      array1: [1, 2],
      array2: [1, 2],
    };
    const changes = {
      string1: '',
      undef: undefined,
      array1: FieldValue.arrayRemove([1, 2]),
    };
    const result = createUpdate(object, changes, {
      deleteEmptyFields: [
        'string1',
        'string2',
        'undef',
        'null',
        'array1',
        'array2',
        'missing',
      ],
    });

    expect(result.after.string1).not.toBeDefined();
    expect(result.after.undef).not.toBeDefined();
    expect(result.after.array1).not.toBeDefined();
    // Does not remove non-empty fields
    expect(result.after.string2).toBe('string2');
    expect(result.after.null).toBe(null);
    expect(result.after.array2).toEqual([1, 2]);

    expect(result.changes.string1).toEqual(FieldValue.delete());
    expect(result.changes.undef).toEqual(FieldValue.delete());
    expect(result.changes.array1).toEqual(FieldValue.delete());
  });
});
