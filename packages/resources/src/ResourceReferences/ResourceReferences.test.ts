import { ValidationError } from '@minddrop/utils';
import { ResourceReferences } from './ResourceReferences';

describe('ResourceReferences', () => {
  describe('get', () => {
    it('returns references of the given type', () => {
      // Get 'topic' type resource references
      const topicRefs = ResourceReferences.get('topic', [
        { resource: 'other', id: 'id' },
        { resource: 'topic', id: 'id-2' },
      ]);

      expect(topicRefs).toEqual([{ resource: 'topic', id: 'id-2' }]);
    });
  });

  describe('getIds', () => {
    it('returns IDs of the references of the given type', () => {
      // Get 'topic' type resource reference IDs
      const topicRefs = ResourceReferences.getIds('topic', [
        { resource: 'other', id: 'id' },
        { resource: 'topic', id: 'id-2' },
      ]);

      expect(topicRefs).toEqual(['id-2']);
    });
  });

  describe('contains', () => {
    it('returns `true` if the given references contain a reference of the given type', () => {
      // Check if the references contain 'topic' types references.
      // Should return `true`
      const contains = ResourceReferences.contains('topic', [
        { resource: 'other', id: 'id' },
        { resource: 'topic', id: 'id-2' },
      ]);

      expect(contains).toBe(true);
    });

    it('returns `false` if the given references do not contain a reference of the given type', () => {
      // Check if the references contain 'topic' types references.
      // Should return `false`
      const contains = ResourceReferences.contains('topic', [
        { resource: 'foo', id: 'id' },
        { resource: 'bar', id: 'id-2' },
      ]);

      expect(contains).toBe(false);
    });
  });

  describe('validate', () => {
    it('validates an array of resource references', () => {
      // Validate an array of resource references containing and invalid
      // reference. Should throw a `ResourceValidationError`.
      expect(() =>
        ResourceReferences.validate([
          { resource: 'topic', id: 'id' },
          // @ts-ignore
          { resource: 'topic' },
        ]),
      ).toThrowError(ValidationError);
    });
  });
});
