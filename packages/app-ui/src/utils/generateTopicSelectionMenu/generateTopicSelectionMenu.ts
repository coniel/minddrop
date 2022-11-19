import { Topics } from '@minddrop/topics';
import { MenuTopicSelectionItemConfig } from '@minddrop/ui';

function createTree(
  topicId: string,
  onSelect: (event: Event, topicId: string) => void,
  excludeTopicIds: string[] = [],
): MenuTopicSelectionItemConfig {
  const topic = Topics.get(topicId);

  return {
    type: 'menu-topic-selection-item',
    id: topicId,
    onSelect: (event) => onSelect(event, topic.id),
    label: topic.title,
    subtopics: topic.subtopics
      .filter((id) => !excludeTopicIds.includes(id))
      .map((subtopicId) => createTree(subtopicId, onSelect, excludeTopicIds)),
  };
}

/**
 * Generates a tree of TopicSelectionMenuItemData items
 * for given topics. The given topics are used as the roots
 * of the tree, their subtopics being further down.
 *
 * Specific topics can be excluded from the tree by providing
 * an array of topics as the `excludeTopicIds`. The topics are
 * excluded at all level of the tree.
 *
 * @param rootTopicIds The IDs of the topics appearing at the root level of the menu.
 * @param onSelect The callback fired when a topic is selected.
 * @param excludeTopicIds The IDs of topics to exlcude from the generated tree.
 * @returns An array of TopicSelectionMenuData items.
 */
export function generateTopicSelectionMenu(
  rootTopicIds: string[],
  onSelect: (event: Event, topicId: string) => void,
  excludeTopicIds: string[] = [],
): MenuTopicSelectionItemConfig[] {
  return Object.values(
    rootTopicIds
      .filter((id) => !excludeTopicIds.includes(id))
      .map((topicId) => createTree(topicId, onSelect, excludeTopicIds)),
  );
}
