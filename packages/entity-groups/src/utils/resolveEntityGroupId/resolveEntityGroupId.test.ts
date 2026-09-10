import { describe, expect, it } from 'vitest';
import { EntityGroupEntityType } from '../../constants';
import { resolveEntityGroupId } from './resolveEntityGroupId';

describe('resolveEntityGroupId', () => {
  it('prefixes the name with the entity type', () => {
    expect(resolveEntityGroupId('sidebar-library')).toBe(
      `${EntityGroupEntityType}_sidebar-library`,
    );
  });

  it('resolves the same name to the same ID', () => {
    expect(resolveEntityGroupId('library')).toBe(
      resolveEntityGroupId('library'),
    );
  });

  it('resolves different names to different IDs', () => {
    expect(resolveEntityGroupId('library')).not.toBe(
      resolveEntityGroupId('databases'),
    );
  });
});
