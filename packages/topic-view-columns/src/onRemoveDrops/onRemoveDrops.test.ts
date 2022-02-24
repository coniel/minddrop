import { DROPS_TEST_DATA } from '@minddrop/drops';
import { Views } from '@minddrop/views';
import {
  setup,
  cleanup,
  core,
  topicViewColumnsInstance,
  colItemTextDrop2,
  colItemTextDrop4,
} from '../test-utils';
import { TopicViewColumnsInstance } from '../types';
import { onRemoveDrops } from './onRemoveDrops';

const { textDrop1, textDrop3 } = DROPS_TEST_DATA;

describe('onRemoveDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the drops from columns', () => {
    onRemoveDrops(core, topicViewColumnsInstance, {
      [textDrop1.id]: textDrop1,
      [textDrop3.id]: textDrop3,
    });

    const instance = Views.getInstance<TopicViewColumnsInstance>(
      topicViewColumnsInstance.id,
    );

    expect(instance.columns).toEqual([
      [],
      [colItemTextDrop2],
      [colItemTextDrop4],
    ]);
  });
});
