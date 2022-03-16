import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { InstanceView } from '@minddrop/views';
import { TopicViewInstance } from '.';
import { Topic, TopicMap } from './Topic.types';

/**
 * Metadata about the event when a drop is added to a topic.
 * Contains the ID of the view instance into which the drop
 * was added (or `null` if not added by a view) and any other
 * data added by the view which added the drop.
 */
export interface AddDropsMetadata {
  viewInstance: string | null;
}

export interface TopicView<
  I extends TopicViewInstance = TopicViewInstance,
  M extends AddDropsMetadata = AddDropsMetadata,
> extends Omit<InstanceView, 'type'> {
  // All TopicViews are instance views
  type: 'instance';

  /**
   * The name of the view. Dispalyed to users.
   */
  name: string;

  /**
   * A short, single sentence description of the view. Displayed
   * to users.
   */
  description: string;

  /**
   * Called when a new instance of the topic view is created.
   * Should use `Views.createInstance` internally to create the
   * view instance and return the created instance.
   *
   * @param core A MindDrop core instance.
   * @param topic The topic inside which the view was created.
   * @returns The new topic view instance.
   */
  onCreate?(core: Core, topic: Topic): object;

  /**
   * Called when an instance of the topic view is deleted.
   * Useful for cleaning up any artifacts created by the view
   * instance.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The deleted view instance.
   */
  onDelete?(core: Core, viewInstance: I): void;

  /**
   * Called on all of a topic's views when drops are added, unarchived,
   * or restored to the topic.
   *
   * The `metadata` param contains metadata about the event.
   * Contains the ID of the view instance into which the drop
   * was added (or `null` if not added by a view) and any other
   * data added by the view which added the drop.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The view instance.
   * @param drops The added drops.
   * @param metadata Metadata about the event.
   */
  onAddDrops?(core: Core, viewInstance: I, drops: DropMap, metadata: M): void;

  /**
   * Called on all of a topic's views when drops are archived, deleted,
   * or permanently deleted from the topic.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The view instance.
   * @param drops The removed drops.
   */
  onRemoveDrops?(core: Core, viewInstance: I, drops: DropMap): void;

  /**
   * Called on all of a topic's views when subtopics are added, unarchived,
   * or restored to the topic.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The view instance.
   * @param subtopics The added subtopics.
   */
  onAddSubtopics?(
    core: Core,
    viewInstance: I,
    subtopics: TopicMap,
    metadata: M,
  ): void;

  /**
   * Called on all of a topic's views when subtopics are archived, deleted,
   * or permanently deleted from the topic.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The view instance.
   * @param subtopics The removed subtopics.
   */
  onRemoveSubtopics?(core: Core, viewInstance: I, subtopics: TopicMap): void;
}

export type RegisterTopicViewData = Omit<TopicView, 'extension'>;
export type TopicViewMap = Record<string, TopicView>;
