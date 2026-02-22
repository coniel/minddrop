import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  defaultCardDesign,
  objectDatabase,
  setup,
} from '../test-utils';
import { getDatabaseDesignPropertyMap } from './getDatabaseDesignPropertyMap';

describe('getDatabaseDesignPropertyMap', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the design property map if it exists', () => {
    const propertyMap = getDatabaseDesignPropertyMap(
      objectDatabase.id,
      defaultCardDesign.id,
    );

    expect(propertyMap).toEqual(
      objectDatabase.designPropertyMaps[defaultCardDesign.id],
    );
  });

  it('returns null if the design property map does not exist', () => {
    const propertyMap = getDatabaseDesignPropertyMap(
      objectDatabase.id,
      'non-existent',
    );

    expect(propertyMap).toBeNull();
  });
});
