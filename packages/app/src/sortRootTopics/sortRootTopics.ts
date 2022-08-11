import { Core } from '@minddrop/core';
import { InvalidParameterError } from '@minddrop/utils';
import { useAppStore } from '../useAppStore';
import { getRootTopics } from '../getRootTopics';

const InvalidParameterErrorMessage =
  're-sorted root topic IDs must contain exactly the same topic IDs as the current value';

/**
 * Sets a new sort order for root topics.
 * The provided root topic IDs must contain the same
 * IDs as the current value, only in a different order.
 * Dispatches a `app:root-topics:sort` event.
 *
 * @param core - A MindDrop core instance.
 * @param topicIds - The IDs of the root topics in their new sort order.
 *
 * @throws InvalidParameterError
 * Thrown if the given topic IDs differ from the
 * current root topic IDs in anything but order.
 */
export function sortRootTopics(core: Core, topicIds: string[]): void {
  // Get the root topics IDs
  const rootTopics = getRootTopics();

  // Ensure that the provided topic IDs do not differ from
  // the current root topic IDs in anything but order.
  if (topicIds.length !== rootTopics.length) {
    // If the lengths differ, throw an error
    throw new InvalidParameterError(InvalidParameterErrorMessage);
  } else {
    rootTopics.forEach((rootTopic) => {
      if (!topicIds.includes(rootTopic.id)) {
        // If the contents differ, throw an error
        throw new InvalidParameterError(InvalidParameterErrorMessage);
      }
    });
  }

  // Update the root topic IDs in the app store
  useAppStore.getState().setRootTopics(topicIds);

  // Dispatch a 'app:root-topics:sort' event
  core.dispatch('app:root-topics:sort', topicIds);
}
