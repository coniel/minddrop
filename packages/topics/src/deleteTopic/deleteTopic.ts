/**
 * Deletes a topic by moving it and its contents to the
 * MindDrop trash directory. Dispatches a
 * 'topics:topic:delete' event.
 *
 * @param core - A MindDrop core instance.
 * @param path - The path of the topic to delete.
 */
export async function deleteTopic(): Promise<void> {
  // Get topic
  // Ensure topic file/directory exists
  // Remove topic from store
  // Move topic to trash
  // Dispatch 'topics:topic:delete' event
}
