import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import { EntityGroupSourceDataKey } from '../../constants';
import { cleanup, dragDataTransfer, setup } from '../../test-utils';
import { resolveEntityGroupDragSource } from './resolveEntityGroupDragSource';

const { entityGroup_exclusive_1 } = EntityGroupFixtures;

describe('resolveEntityGroupDragSource', () => {
  beforeEach(setup);

  afterEach(cleanup);

  // Returns a drop event carrying the given data transfer object,
  // which the environment's drag events do not take on construction
  function dropEvent(dataTransfer: DataTransfer): DragEvent {
    const event = new DragEvent('drop');

    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });

    return event;
  }

  it('returns the group the drag was started in', () => {
    const dataTransfer = dragDataTransfer();

    dataTransfer.setData(
      Selection.toMimeType(EntityGroupSourceDataKey),
      JSON.stringify(entityGroup_exclusive_1.id),
    );

    expect(resolveEntityGroupDragSource(dropEvent(dataTransfer))).toBe(
      entityGroup_exclusive_1.id,
    );
  });

  it('returns null for a drag which carries no group', () => {
    expect(resolveEntityGroupDragSource(dropEvent(dragDataTransfer()))).toBe(
      null,
    );
  });
});
