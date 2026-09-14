/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { EntityGroupNotFoundError } from '../errors';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { EntityGroupFixtures, cleanup, setup } from '../test-utils';
import { createEntityGroupsFacade } from './createEntityGroupsFacade';

const {
  addressedItem_2,
  plainItem_1,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_multi_1,
  entityGroup_protected,
  exclusiveGroups,
  multiGroups,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

describe('createEntityGroupsFacade', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('binds the lookups to the type', () => {
    const facade = createEntityGroupsFacade(type);

    expect(facade.getAll()).toEqual(exclusiveGroups);
    expect(facade.get(entityGroup_exclusive_1.id)).toEqual(
      entityGroup_exclusive_1,
    );
    expect(facade.get(entityGroup_multi_1.id, false)).toBeNull();
    expect(() => facade.get(entityGroup_multi_1.id)).toThrow(
      EntityGroupNotFoundError,
    );
    expect(facade.getForItem(plainItem_1)).toEqual([entityGroup_exclusive_1]);
  });

  it('binds the protection check to the type', () => {
    const facade = createEntityGroupsFacade(groupTypeConfig_multi.id);

    expect(facade.isProtected(entityGroup_protected.id)).toBe(true);
    expect(facade.isProtected(entityGroup_multi_1.id)).toBe(false);
  });

  it('binds the group mutations to the type', async () => {
    const facade = createEntityGroupsFacade(type);

    const created = await facade.create('Created');
    await facade.update(created.id, { name: 'Renamed' });
    await facade.reorder([entityGroup_exclusive_2.id]);
    await facade.delete(entityGroup_exclusive_1.id);

    expect(getAllEntityGroups(type).map(({ id, name }) => [id, name])).toEqual([
      [entityGroup_exclusive_2.id, entityGroup_exclusive_2.name],
      [created.id, 'Renamed'],
      [exclusiveGroups[2].id, exclusiveGroups[2].name],
    ]);
    expect(getAllEntityGroups(groupTypeConfig_multi.id)).toEqual(multiGroups);
  });

  it('binds the item mutations to the type', async () => {
    const facade = createEntityGroupsFacade(type);

    await facade.addItem(entityGroup_exclusive_2.id, plainItem_1);
    await facade.moveItem(
      entityGroup_exclusive_2.id,
      entityGroup_exclusive_1.id,
      addressedItem_2,
    );
    await facade.reorderItems(entityGroup_exclusive_1.id, [
      addressedItem_2,
      entityGroup_exclusive_1.items[0],
    ]);
    await facade.removeItem(entityGroup_exclusive_2.id, plainItem_1);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_2,
      entityGroup_exclusive_1.items[0],
    ]);
    expect(getEntityGroup(type, entityGroup_exclusive_2.id).items).toEqual([]);
  });

  it('binds the hooks to the type', () => {
    const facade = createEntityGroupsFacade(type);

    expect(renderHook(() => facade.useAll()).result.current).toEqual(
      exclusiveGroups,
    );
    expect(
      renderHook(() => facade.use(entityGroup_exclusive_1.id)).result.current,
    ).toEqual(entityGroup_exclusive_1);
    expect(
      renderHook(() => facade.use(entityGroup_multi_1.id)).result.current,
    ).toBeNull();
    expect(
      renderHook(() => facade.useForItem(plainItem_1)).result.current,
    ).toEqual([entityGroup_exclusive_1]);
  });
});
