import { Core } from '@minddrop/core';
import { DropMap } from '@minddrop/drops';
import { InstanceViewConfig, ViewInstanceTypeData } from '@minddrop/views';
import { TopicViewInstance } from './TopicViewInstance.types';
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

export interface TopicViewConfig<
  TData extends ViewInstanceTypeData = {},
  TMetadata extends AddDropsMetadata = AddDropsMetadata,
> extends Omit<InstanceViewConfig<TData>, 'type'> {
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
   * The default data used when creating a new view instance of this
   * type. The data supplied to the `create` method is merged into
   * the default data, overwriting any overlaping values.
   *
   * For more advanced needs, such as modifying the default
   * data based on the data provided to the `create` method,
   * use the `onCreate` callback.
   */
  defaultdata?: Partial<TData>;

  /**
   * Called when a new instance of the topic view is created. Should
   * return an object containing the initial state of the custom data
   * used in the view instance. Initialized data is merged into the
   * view instance type's `defaultData`.
   *
   * Omit if the view instance does not use custom data.
   *
   * @param core A MindDrop core instance.
   * @param topic The topic inside which the view was created.
   * @returns The new topic view instance.
   */
  initializeData?(core: Core, topic: Topic): object;

  /**
   * Called when an instance of the topic view is deleted.
   * Useful for cleaning up any artifacts created by the view
   * instance.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The deleted view instance.
   */
  onDelete?(core: Core, viewInstance: TopicViewInstance): void;

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
  onAddDrops?(
    core: Core,
    viewInstance: TopicViewInstance<TData>,
    drops: DropMap,
    metadata: TMetadata,
  ): void;

  /**
   * Called on all of a topic's views when drops are archived, deleted,
   * or permanently deleted from the topic.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The view instance.
   * @param drops The removed drops.
   */
  onRemoveDrops?(
    core: Core,
    viewInstance: TopicViewInstance<TData>,
    drops: DropMap,
  ): void;

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
    viewInstance: TopicViewInstance<TData>,
    subtopics: TopicMap,
    metadata: TMetadata,
  ): void;

  /**
   * Called on all of a topic's views when subtopics are archived, deleted,
   * or permanently deleted from the topic.
   *
   * @param core A MindDrop core instance.
   * @param viewInstance The view instance.
   * @param subtopics The removed subtopics.
   */
  onRemoveSubtopics?(
    core: Core,
    viewInstance: TopicViewInstance<TData>,
    subtopics: TopicMap,
  ): void;
}

export interface RegisteredTopicViewConfig<
  TData extends ViewInstanceTypeData = {},
  TMetadata extends AddDropsMetadata = AddDropsMetadata,
> extends TopicViewConfig<TData, TMetadata> {
  /*
   * The view type, always 'instance'.
   */
  type: 'instance';

  /*
   * The ID of the extension that registered the view.
   */
  extension: string;
}
