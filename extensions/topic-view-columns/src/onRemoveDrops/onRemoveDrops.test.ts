import { DROPS_TEST_DATA } from '@minddrop/drops';
import { ViewInstances } from '@minddrop/views';
import { ResourceReferences } from '@minddrop/resources';
import { setup, cleanup, core, topicViewColumnsInstance } from '../test-utils';
import { TopicViewColumnsData } from '../types';
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
});
