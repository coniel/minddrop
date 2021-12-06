import { MockDate } from '@minddrop/test-utils';
import { FieldValue } from '../FieldValue';
import { createUpdate } from './createUpdate';

describe('createUpdate', () => {
  it('creates an update object with changes applied', () => {
    MockDate.set('01/01/2000');
    const object = {
      updatedAt: new Date('01/01/1999'),
      title: 'Title',
      optional: 'optional',
      array: [1, 2],
      array2: [1, 2],
    };
    const changes = {
      title: 'Updated title',
      optional: FieldValue.delete(),
      array: FieldValue.arrayUnion(3, 4),
      array2: FieldValue.arrayRemove(2),
    };
    const result = createUpdate(object, changes);

    expect(result.changes).toEqual({ ...changes, updatedAt: new Date() });
    expect(result.after).toEqual({
      title: 'Updated title',
      array: [1, 2, 3, 4],
      array2: [1],
      updatedAt: new Date(),
    });
    // Before should equal original object
    expect(result.before).toEqual(object);

    MockDate.reset();
  });
});
