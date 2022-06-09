import { arrayContainsObject } from './arrayContainsObject';

const objects = [
  { type: 'topic', id: 'topic-id-1' },
  { type: 'topic', id: 'topic-id-2' },
  { type: 'topic', id: 'topic-id-3' },
  { type: 'topic', id: 'topic-id-4' },
];

describe('arrayContainsObject', () => {
  it('returns `true` if the array contains a matching object', () => {
    expect(
      arrayContainsObject(objects, { type: 'topic', id: 'topic-id-3' }),
    ).toBeTruthy();
  });

  it('returns `false` if the array does not contain a matching object', () => {
    // No match `id`
    expect(
      arrayContainsObject(objects, { type: 'topic', id: 'topic-id-5' }),
    ).toBeFalsy();

    // Missing a key
    expect(arrayContainsObject(objects, { type: 'topic' })).toBeFalsy();

    // With an additional key
    expect(
      arrayContainsObject(objects, {
        type: 'topic',
        id: 'topic-1-id',
        deleted: true,
      }),
    ).toBeFalsy();
  });

  it('works with arrays containing other data types', () => {
    const mixed = ['foo', 123, false, null, undefined, ...objects];

    expect(
      arrayContainsObject(mixed, { type: 'topic', id: 'topic-id-3' }),
    ).toBeTruthy();
  });
});
