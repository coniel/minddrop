import { DROPS_TEST_DATA } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { ViewInstances } from '@minddrop/views';
import { ResourceReferences } from '@minddrop/resources';
import { TopicViewInstanceData } from '@minddrop/topics';
import { setup, cleanup, core, topicViewColumnsInstance } from '../test-utils';
import {
  TopicViewColumnsData,
  UpdateTopicViewColumnsInstanceData,
} from '../types';
import { onRemoveDrops } from './onRemoveDrops';

const { drop1, drop2, drop3, drop4 } = DROPS_TEST_DATA;

const drop1Reference = ResourceReferences.generate('drops:drop', drop1.id);
const drop2Reference = ResourceReferences.generate('drops:drop', drop2.id);
const drop4Reference = ResourceReferences.generate('drops:drop', drop4.id);

describe('onRemoveDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the drops from columns', () => {
    onRemoveDrops(core, topicViewColumnsInstance, {
      [drop3.id]: drop3,
    });

    const instance = ViewInstances.get<TopicViewColumnsData>(
      topicViewColumnsInstance.id,
    );

    expect(instance.columns).toEqual([
      { id: 'column-0', items: [drop1Reference] },
      { id: 'column-1', items: [drop2Reference] },
      { id: 'column-2', items: [drop4Reference] },
    ]);
  });

  it('removes emptied columns', () => {
    // Add additional columns to the view instance
    let instance = ViewInstances.update<
      UpdateTopicViewColumnsInstanceData,
      TopicViewInstanceData<TopicViewColumnsData>
    >(core, topicViewColumnsInstance.id, {
      columns: FieldValue.arrayUnion([
        { id: 'column-3', items: [] },
        { id: 'column-4', items: [] },
      ]),
    });

    // Remove drops
    onRemoveDrops(core, instance, {
      [drop1.id]: drop1,
      [drop3.id]: drop3,
    });

    // Get updated instance
    instance = ViewInstances.get<TopicViewInstanceData<TopicViewColumnsData>>(
      topicViewColumnsInstance.id,
    );

    // Should remove column from which drops were removed
    expect(instance.columns).toEqual([
      { id: 'column-1', items: [drop2Reference] },
      { id: 'column-2', items: [drop4Reference] },
      { id: 'column-3', items: [] },
      { id: 'column-4', items: [] },
    ]);
  });
});
