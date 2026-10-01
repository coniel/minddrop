import { Events } from '@minddrop/events';
import { onTagDeleted, onTagRenamed } from '../event-handlers';
import { TagDeletedEvent, TagRenamedEvent } from '../events';

/**
 * Registers the event handlers for tag lifecycle events.
 */
export function initializeTagEventHandlers(): void {
  // Register the tag event handlers
  Events.addListeners('tags', {
    [TagRenamedEvent]: onTagRenamed,
    [TagDeletedEvent]: onTagDeleted,
  });
}
