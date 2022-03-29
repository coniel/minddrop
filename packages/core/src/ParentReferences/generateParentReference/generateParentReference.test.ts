import { generateParentReference } from './generateParentReference';

describe('generateParentReference', () => {
  it('returns a parent reference with appropriate data', () => {
    // Generate a parent refence
    const parent = generateParentReference('topic', 'topic-id');

    // Should returna valid parent reference
    expect(parent).toEqual({ type: 'topic', id: 'topic-id' });
  });
});
