import { DROPS_TEST_DATA } from '@minddrop/drops';
import { Views } from '@minddrop/views';
import {
  setup,
  cleanup,
  core,
  topicViewColumnsInstance,
  colItemTextDrop3,
  colItemTextDrop4,
} from '../test-utils';
import { ColumnsAddDropsMetadata, TopicViewColumnsInstance } from '../types';
import { onAddDrops } from './onAddDrops';

const { textDrop4, imageDrop1 } = DROPS_TEST_DATA;
const instanceId = topicViewColumnsInstance.id;
const addedItems = [
  { type: 'drop', id: textDrop4.id },
  { type: 'drop', id: imageDrop1.id },
];

const metadata = (
  data: Partial<ColumnsAddDropsMetadata>,
): ColumnsAddDropsMetadata => ({
  viewInstance: instanceId,
  column: 0,
  index: topicViewColumnsInstance.columns[0].length,
  ...data,
});

const call = (metadata?: ColumnsAddDropsMetadata) =>
  onAddDrops(
    core,
    topicViewColumnsInstance,
    { [textDrop4.id]: textDrop4, [imageDrop1.id]: imageDrop1 },
    metadata,
  );

const getInstance = () =>
  Views.getInstance<TopicViewColumnsInstance>(instanceId);

describe('onAddDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('distributes drops between columns if metadata is not present', () => {
    call();

    const instance = getInstance();

    // Initial column drop counts are 0: 1, 1: 1, 2: 2, 3: 0
    expect(instance.columns[0].length).toEqual(2);
    expect(instance.columns[1].length).toEqual(1);
    expect(instance.columns[2].length).toEqual(2);
    expect(instance.columns[3].length).toEqual(1);
  });

  it('adds drops to the end of the columm', () => {
    call(
      metadata({
        column: 2,
        index: topicViewColumnsInstance.columns[2].length,
      }),
    );

    const instance = getInstance();

    expect(instance.columns[2].slice(-2)).toEqual(addedItems);
  });

  it('adds drops to the specified column index', () => {
    call(metadata({ column: 2, index: 1 }));

    const instance = getInstance();

    // Original column 2 contains [colItemTextDrop3, colItemTextDrop4]
    expect(instance.columns[2]).toEqual([
      colItemTextDrop3,
      ...addedItems,
      colItemTextDrop4,
    ]);
  });

  it('ignores metadata if metadata.viewInstance !== viewInstance.id', () => {
    call(metadata({ column: 2, index: 0, viewInstance: 'other' }));

    const instance = getInstance();

    // Initial column drop counts are 0: 1, 1: 1, 2: 2, 3: 0
    expect(instance.columns[0].length).toEqual(2);
    expect(instance.columns[1].length).toEqual(1);
    expect(instance.columns[2].length).toEqual(2);
    expect(instance.columns[3].length).toEqual(1);
  });
});
