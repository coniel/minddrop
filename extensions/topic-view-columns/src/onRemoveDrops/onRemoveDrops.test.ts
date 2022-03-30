import { DROPS_TEST_DATA } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import {
  setup,
  cleanup,
  core,
  topicViewColumnsInstance,
  colItemTextDrop2,
  colItemTextDrop4,
  colItemTextDrop1,
} from '../test-utils';
import {
  TopicViewColumnsInstance,
  UpdateTopicViewColumnsInstanceData,
} from '../types';
import { onRemoveDrops } from './onRemoveDrops';

const { textDrop1, textDrop3 } = DROPS_TEST_DATA;

describe('onRemoveDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the drops from columns', () => {
    onRemoveDrops(core, topicViewColumnsInstance, {
      [textDrop3.id]: textDrop3,
    });

    const instance = Views.getInstance<TopicViewColumnsInstance>(
      topicViewColumnsInstance.id,
    );

    expect(instance.columns).toEqual([
      { id: 'column-0', items: [colItemTextDrop1] },
      { id: 'column-1', items: [colItemTextDrop2] },
      { id: 'column-2', items: [colItemTextDrop4] },
    ]);
  });

  it('removes emptied columns', () => {
    // Add additional columns to the view instance
    let instance = Views.updateInstance<
      UpdateTopicViewColumnsInstanceData,
      TopicViewColumnsInstance
    >(core, topicViewColumnsInstance.id, {
      columns: FieldValue.arrayUnion([
        { id: 'column-3', items: [] },
        { id: 'column-4', items: [] },
      ]),
    });

    // Remove drops
    onRemoveDrops(core, instance, {
      [textDrop1.id]: textDrop1,
      [textDrop3.id]: textDrop3,
    });

    // Get updated instance
    instance = Views.getInstance<TopicViewColumnsInstance>(
      topicViewColumnsInstance.id,
    );

    // Should remove column from which drops were removed
    expect(instance.columns).toEqual([
      { id: 'column-1', items: [colItemTextDrop2] },
      { id: 'column-2', items: [colItemTextDrop4] },
      { id: 'column-3', items: [] },
      { id: 'column-4', items: [] },
    ]);
  });
});