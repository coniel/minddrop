import { generateResourceReference } from './generateResourceReference';

describe('generateResourceReference', () => {
  it('returns a resource reference with appropriate data', () => {
    // Generate a resource refence
    const reference = generateResourceReference('topics:topic', 'topic-id');

    // Should return a valid reference
    expect(reference).toEqual({ resource: 'topics:topic', id: 'topic-id' });
  });
});
