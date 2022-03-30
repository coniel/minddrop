import { DropMap, Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import {
  setup,
  cleanup,
  core,
  topicViewColumnsInstance,
  colItemTextDrop2,
  colItemTextDrop3,
} from '../test-utils';
import {
  ColumnsAddDropsMetadata,
  CreateColumnMetadata,
  InsertIntoColumnMetadata,
  TopicViewColumnsInstance,
} from '../types';
import { onAddDrops } from './onAddDrops';

const { textDrop4, imageDrop1, htmlDrop1 } = DROPS_TEST_DATA;
const instanceId = topicViewColumnsInstance.id;
const addedItems = [
  { type: 'drop', id: textDrop4.id },
  { type: 'drop', id: imageDrop1.id },
  { type: 'drop', id: htmlDrop1.id },
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
    mapById([textDrop4, imageDrop1, htmlDrop1]) as DropMap,
    metadata,
  );

const getInstance = () =>
  Views.getInstance<TopicViewColumnsInstance>(instanceId);

describe('onAddDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it.only('places duplciated drops below their originals', () => {
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
      { id: dropId0, type: 'drop' },
      { id: duplicateDrop0.id, type: 'drop' },
      { id: dropId1, type: 'drop' },
      { id: duplicateDrop1.id, type: 'drop' },
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

    // Original column 1 contains [colItemTextDrop2, colItemTextDrop3]
    expect(instance.columns[1].items).toEqual([
      colItemTextDrop2,
      ...addedItems,
      colItemTextDrop3,
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