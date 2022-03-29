import { ParentReferenceValidationError } from '../errors';
import { ParentReferences } from './ParentReferences';

describe('ParentReferences', () => {
  describe('get', () => {
    it('returns references of the given type', () => {
      // Get 'topic' type parent references
      const topicRefs = ParentReferences.get('topic', [
        { type: 'other', id: 'id' },
        { type: 'topic', id: 'id-2' },
      ]);

      expect(topicRefs).toEqual([{ type: 'topic', id: 'id-2' }]);
    });
  });

  describe('getIds', () => {
    it('returns IDs of the references of the given type', () => {
      // Get 'topic' type parent reference IDs
      const topicRefs = ParentReferences.getIds('topic', [
        { type: 'other', id: 'id' },
        { type: 'topic', id: 'id-2' },
      ]);

      expect(topicRefs).toEqual(['id-2']);
    });
  });

  describe('contains', () => {
    it('returns `true` if the given references contain a reference of the given type', () => {
      // Check if the references contain 'topic' types references.
      // Should return `true`
      const contains = ParentReferences.contains('topic', [
        { type: 'other', id: 'id' },
        { type: 'topic', id: 'id-2' },
      ]);

      expect(contains).toBe(true);
    });

    it('returns `false` if the given references do not contain a reference of the given type', () => {
      // Check if the references contain 'topic' types references.
      // Should return `false`
      const contains = ParentReferences.contains('topic', [
        { type: 'foo', id: 'id' },
        { type: 'bar', id: 'id-2' },
      ]);

      expect(contains).toBe(false);
    });
  });

  describe('validate', () => {
    it('validates an array of parent references', () => {
      // Validate an array of parent references containing and invalid
      // reference. Should throw a `ParentReferenceValidationError`.
      expect(() =>
        ParentReferences.validate([
          { type: 'topic', id: 'id' },
          // @ts-ignore
          { type: 'topic' },
        ]),
      ).toThrowError(ParentReferenceValidationError);
    });
  });
});
