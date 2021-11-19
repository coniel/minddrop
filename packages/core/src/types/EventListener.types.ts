import { Drop } from './Drop.types';
import { Topic } from './Topic.types';
import { DataInsert } from './DataInsert.types';

export type AppEventType = 'insert-data' | 'load-topics' | 'load-drops';

// Simple topic events are events for which
// the data is a single Topic object.
export type SimpleTopicEventType =
  | 'add-topic'
  | 'archive-topic'
  | 'unarchive-topic'
  | 'trash-topic'
  | 'restore-topic'
  | 'delete-topic';

export type TopicEventType =
  | SimpleTopicEventType
  | 'update-topic'
  | 'move-topic';

// Simple drop events are events for which
// the data is a single Drop object.
export type SimpleDropEventType =
  | 'archive-drop'
  | 'unarchive-drop'
  | 'trash-drop'
  | 'restore-drop'
  | 'delete-drop';

export type DropEventType =
  | SimpleDropEventType
  | 'add-drop'
  | 'update-drop'
  | 'move-drop';

export type EventType = AppEventType | TopicEventType | DropEventType;

export interface TopicMove {
  /**
   * The topic ID from which the topic was moved/added.
   * `null` if the topic was moved/copied from the root level.
   */
  from: string | null;

  /**
   * The topic ID to which the topic is being added.
   * `null` if topic is being moved/added to the root level.
   */
  to: string | null;

  /**
   * The topic being moved.
   */
  topic: Topic;
}

export interface TopicChange {
  /**
   * Topic data before it was changed.
   */
  before: Topic;

  /**
   * Updated topic data.
   */
  after: Topic;
}

export interface DropAdd {
  /**
   * The drop data.
   */
  drop: Drop;

  /**
   * The drop's files. Only set if the drop has files.
   */
  files?: File[];
}

export interface DropChange {
  /**
   * The drop data prior to being updated.
   */
  before: Drop;

  /**
   * The updated drop data.
   */
  after: Drop;

  /**
   * The drop's files. Only set if files were added to the drop during the update.
   */
  files?: File[];
}

export interface DropMove {
  /**
   * The ID of the topic from which the drop was moved/added.
   */
  from: string;

  /**
   * The ID of the topic to which the drop was moved/added.
   */
  to: string;

  /**
   * The drop being moved.
   */
  drop: Drop;
}
export type EventData =
  | string
  | null
  | DataInsert
  | Topic
  | Topic[]
  | TopicChange
  | TopicMove
  | Drop
  | Drop[]
  | DropAdd
  | DropChange
  | DropMove;

export type EventListenerCallback<T> = (data: T) => void;

export interface EventListener {
  /**
   * The source from which the event listener was added.
   * Either 'core' or an extension ID.
   */
  source: string;

  /**
   * The type of event to listen to.
   */
  type: EventType;

  /**
   * The callback fired when the event occurs.
   */
  callback: EventListenerCallback<EventData>;
}

export type DispatchLoadTopics = (type: 'load-topics', data: Topic[]) => void;
export type DispatchLoadDrops = (type: 'load-drops', data: Drop[]) => void;

export type Dispatch = DispatchLoadTopics | DispatchLoadDrops;
