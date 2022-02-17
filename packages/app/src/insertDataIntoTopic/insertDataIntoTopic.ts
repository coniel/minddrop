import { Core, DataInsert } from '@minddrop/core';
import { Drops } from '@minddrop/drops';
import { Extensions } from '@minddrop/extensions';
import { AddDropsMetadata, Topics } from '@minddrop/topics';

/**
 * Handles data inserts into a topic depending on the insert's `action` parameter:
 * - `insert`: creates drops from the raw data and adds them to the topic
 * - `copy`: data insert's drops are duplicated and duplicates added to the topic
 * - `cut`: data insert's drops are added to the topic (removal from source is
 *    handled at the time of the cut)
 * - `move`: data insert's drops are added to the topic and removed from the
 *    source topic
 * - `add`: data insert's drops are added to the topic
 *
 * Any other action is ignored.
 *
 * Returns a boolean indicating whether or not the data insert was handled
 * (`false` if action is not one of the ones listed above).
 *
 * @param core A MindDrop core instance.
 * @param topicId The topic into which the data is being inserted.
 * @param metadata Optional metadata added by the view instance which invoked the function.
 */
export async function insertDataIntoTopic<
  M extends AddDropsMetadata = AddDropsMetadata,
>(
  core: Core,
  topicId: string,
  data: DataInsert,
  metadata?: M,
): Promise<boolean> {
  const { action, source } = data;

  // Raw data was inserted
  if (action === 'insert') {
    // Get the topic's extensions
    const topicExtensions = Extensions.getTopicExtensions(topicId);

    // Get the drop type configs added by the topic's extensions
    const dropConfigs = Drops.getRegisteredDropTypes({
      extension: topicExtensions,
    });

    // Create drops using the topic's enabled drop types
    const drops = await Drops.createFromDataInsert(core, data, dropConfigs);

    // Add drops to the topic
    Topics.addDrops(core, topicId, Object.keys(drops), metadata);

    return true;
  }

  // If the data contains no drops, don't do anything
  if (!data.drops || data.drops.length === 0) {
    return false;
  }

  if (action === 'copy') {
    // Duplicate the drops
    const drops = Drops.duplicate(core, data.drops);

    // Add the duplicate drops to the topic
    Topics.addDrops(core, topicId, Object.keys(drops), metadata);

    return true;
  }

  if (action === 'cut' || action === 'add') {
    // Adds drops to the topic
    Topics.addDrops(core, topicId, data.drops, metadata);

    return true;
  }

  if (action === 'move' && source && source.type === 'topic') {
    // Move the drops to the topic
    Topics.moveDrops(core, source.id, topicId, data.drops, metadata);
  }

  return false;
}
