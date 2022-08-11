import { TopicsResource } from '../TopicsResource';

/**
 * Checks whether a topic is a descendant of other topics.
 * A descendant topic can be nested multiple layers deeep
 * inside a parent topic.
 *
 * @param descendantTopicId - The ID of the topic which may be a descendant.
 * @param parentTopicIds - The IDs of the topics which may be a parent.
 * @returns A boolean indicating whether the topic is a descendant.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the topic or any of the potential parent
 * topics do not exist.
 */
export function isDescendant(
  descendantTopicId: string,
  parentTopicIds: string[],
): boolean {
  let match = false;

  // Get the descendant topic
  const descendant = TopicsResource.get(descendantTopicId);
  // Get the descendant's direct parent topic IDs
  const directParentIds = descendant.parents
    .filter((parent) => parent.resource === TopicsResource.resource)
    .map((parent) => parent.id);

  // Check if the topic is a direct descendant
  match = !!directParentIds.find((directParentId) =>
    parentTopicIds.includes(directParentId),
  );

  if (!match) {
    // If the topic is not a direct descendant, recursively
    // check if the topic's parents are descendants.
    match = directParentIds.reduce(
      (parentMatch, directParentId) =>
        isDescendant(directParentId, parentTopicIds) || parentMatch,
      match,
    );
  }

  return match;
}
