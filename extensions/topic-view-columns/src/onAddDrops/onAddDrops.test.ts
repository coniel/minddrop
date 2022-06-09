import { DropMap, Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { ResourceReference, ResourceReferences } from '@minddrop/resources';
import { mapById } from '@minddrop/utils';
import { ViewInstances } from '@minddrop/views';
import { setup, cleanup, core, topicViewColumnsInstance } from '../test-utils';
import {
  ColumnsAddDropsMetadata,
  CreateColumnMetadata,
  InsertIntoColumnMetadata,
  TopicViewColumnsData,
} from '../types';
import { onAddDrops } from './onAddDrops';

const { drop2, drop3, drop4, drop5, drop6 } = DROPS_TEST_DATA;
const instanceId = topicViewColumnsInstance.id;
const addedItems: ResourceReference[] = [
  { resource: 'drops:drop', id: drop4.id },
  { resource: 'drops:drop', id: drop5.id },
  { resource: 'drops:drop', id: drop6.id },
];

const insertIntoColumnMetadata = (
  data: Partial<InsertIntoColumnMetadata>,
): InsertIntoColumnMetadata => ({
  action: 'insert-into-column',
  viewInstance: instanceId,
  column: 0,
  index: topicViewColumnsInstance.columns[0].items.length,
  ...data,
});

const createColumnMetadata = (
  data: Partial<CreateColumnMetadata>,
): CreateColumnMetadata => ({
  action: 'create-column',
  viewInstance: instanceId,
  column: 1,
  ...data,
});

const call = (metadata?: ColumnsAddDropsMetadata) =>
  onAddDrops(
    core,
    topicViewColumnsInstance,
    mapById([drop4, drop5, drop6]) as DropMap,
    metadata,
  );

const getInstance = () => ViewInstances.get<TopicViewColumnsData>(instanceId);

describe('onAddDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('places duplciated drops below their originals', () => {
    // Duplicate drops in column 1
    const dropIds = topicViewColumnsInstance.columns[1].items.map(
      (item) => item.id,
    );
    const duplicateDrops = Drops.duplicate(core, dropIds);

    // Add the duplicate drops
    onAddDrops(core, topicViewColumnsInstance, duplicateDrops);

    // Get the updated view instance
    const instance = getInstance();

    // Column 0 and 2 should be equal original state
    expect(instance.columns[0].items).toEqual(
      topicViewColumnsInstance.columns[0].items,
    );
    expect(instance.columns[2].items).toEqual(
      topicViewColumnsInstance.columns[2].items,
    );
    // Original drop Is
    const [dropId0, dropId1] = dropIds;
    // Get matching duplicate drops
    const duplicateDrop0 = Object.values(duplicateDrops).find(
      (drop) => drop.duplicatedFrom === dropId0,
    );
    const duplicateDrop1 = Object.values(duplicateDrops).find(
      (drop) => drop.duplicatedFrom === dropId1,
    );
    // Duplicate drops should be placed directly below their original
    expect(instance.columns[1].items).toEqual([
      { id: dropId0, resource: 'drops:drop' },
      { id: duplicateDrop0.id, resource: 'drops:drop' },
      { id: dropId1, resource: 'drops:drop' },
      { id: duplicateDrop1.id, resource: 'drops:drop' },
    ]);
  });

  it('distributes drops between columns if metadata is not present and is not duplication', () => {
    call();

    const instance = getInstance();

    // Initial column drop counts are 0: 1, 1: 2, 2: 1
    expect(instance.columns[0].items.length).toEqual(3);
    expect(instance.columns[1].items.length).toEqual(2);
    expect(instance.columns[2].items.length).toEqual(2);
  });

  it('adds drops to the end of the columm', () => {
    call(
      insertIntoColumnMetadata({
        column: 2,
        index: topicViewColumnsInstance.columns[2].items.length,
      }),
    );

    const instance = getInstance();

    expect(instance.columns[2].items.slice(-3)).toEqual(addedItems);
  });

  it('adds drops to the specified column index', () => {
    call(insertIntoColumnMetadata({ column: 1, index: 1 }));

    const instance = getInstance();

    // Original column 1 contains drop2 and drop3
    expect(instance.columns[1].items).toEqual([
      ResourceReferences.generate('drops:drop', drop2.id),
      ...addedItems,
      ResourceReferences.generate('drops:drop', drop3.id),
    ]);
  });

  it('creates a new column at specified index', () => {
    call(createColumnMetadata({ column: 1 }));

    const instance = getInstance();

    expect(instance.columns.length).toBe(4);
    expect(instance.columns[1].items).toEqual(addedItems);
  });

  it('ignores metadata if metadata.viewInstance !== viewInstance.id', () => {
    call(
      insertIntoColumnMetadata({ column: 2, index: 0, viewInstance: 'other' }),
    );

    const instance = getInstance();

    // Initial column drop counts are 0: 1, 1: 2, 2: 1
    expect(instance.columns[0].items.length).toEqual(3);
    expect(instance.columns[1].items.length).toEqual(2);
    expect(instance.columns[2].items.length).toEqual(2);
  });
});
