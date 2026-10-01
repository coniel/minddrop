import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { TagGroupsType } from '../constants';
import { TagRenamedEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { initializeTags } from './initializeTags';

describe('initializeTags', () => {
  beforeEach(() => {
    setup();

    // The tag groups type is registered by initializeTags itself
    EntityGroups.unregisterType(TagGroupsType);
  });

  afterEach(cleanup);

  it('registers the tag groups entity group type', () => {
    initializeTags();

    expect(EntityGroups.getConfig(TagGroupsType).id).toBe(TagGroupsType);
  });

  it('registers the tag event handlers', () => {
    initializeTags();

    expect(Events.hasListener(TagRenamedEvent, 'tags')).toBe(true);
  });
});
