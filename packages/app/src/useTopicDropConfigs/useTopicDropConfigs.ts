import { DropTypeConfig } from '@minddrop/drops';
import { useTopicExtensions } from '@minddrop/extensions';
import { Drops } from '@minddrop/drops';

/**
 * Returns the drop configs for the drop types enabled
 * on the given topic.
 *
 * @param topicId - The ID of the topic for which to retrieve the drop configs.
 * @returns An array of drop confiogs.
 */
export function useTopicDropConfigs(topicId: string): DropTypeConfig[] {
  // Get the topic's extensions
  const extensions = useTopicExtensions(topicId);

  // Return drop configs registered by the topic's extensions
  return Drops.getAllTypeConfigs().filter((config) =>
    extensions.find((extension) => extension.id === config.extension),
  );
}
