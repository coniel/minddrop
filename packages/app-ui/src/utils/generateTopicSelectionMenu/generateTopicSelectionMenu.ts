import { Topics } from '@minddrop/topics';
import { MenuTopicSelectionItemConfig } from '@minddrop/ui';

function createTree(
  topicId: string,
  onSelect: (event: Event, topicId: string) => void,
): MenuTopicSelectionItemConfig {
  const topic = Topics.get(topicId);
  return {
    type: 'menu-topic-selection-item',
    onSelect: (event) => onSelect(event, topic.id),
    label: topic.title,
    subtopics: topic.subtopics.map((subtopicId) =>
      createTree(subtopicId, onSelect),
    ),
  };
}

/**
 * Generates a tree of TopicSelectionMenuItemData items
 * for given topics. The given topics are used as the roots
 * of the tree, their subtopics being further down.
 *
 * @param rootTopicIds The IDs of the topics appearing at the root level of the menu.
 * @param onSelect The callback fired when a topic is selected.
 * @returns An array of TopicSelectionMenuData items.
 */
export function generateTopicSelectionMenu(
  rootTopicIds: string[],
  onSelect: (event: Event, topicId: string) => void,
): MenuTopicSelectionItemConfig[] {
  return Object.values(
    rootTopicIds.map((topicId) => createTree(topicId, onSelect)),
  );
}
