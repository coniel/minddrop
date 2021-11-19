import {
  TopicChange,
  TopicMove,
  DropAdd,
  DropChange,
  DropMove,
  DataInsert,
  EventListenerCallback,
  SimpleDropEventType,
  SimpleTopicEventType,
} from './EventListener.types';
import { Topic } from './Topic.types';
import { Drop } from './Drop.types';

export interface UninitializedApp {
  // App event listeners
  addEventListener(
    source: string,
    type: 'load-topics',
    callback: EventListenerCallback<Topic[]>,
  );
  addEventListener(
    source: string,
    type: 'load-drops',
    callback: EventListenerCallback<Drop[]>,
  );
  addEventListener(
    source: string,
    type: 'insert-data',
    callback: EventListenerCallback<DataInsert>,
  );

  // Topic event listeners
  addEventListener(
    source: string,
    type: SimpleTopicEventType,
    callback: EventListenerCallback<Topic>,
  );
  addEventListener(
    source: string,
    type: 'update-topic',
    callback: EventListenerCallback<TopicChange>,
  );
  addEventListener(
    source: string,
    type: 'move-topic',
    callback: EventListenerCallback<TopicMove>,
  );

  // Drop event listeners
  addEventListener(
    source: string,
    type: SimpleDropEventType,
    callback: EventListenerCallback<Drop>,
  );
  addEventListener(
    source: string,
    type: 'update-drop',
    callback: EventListenerCallback<DropChange>,
  );
  addEventListener(
    source: string,
    type: 'move-drop',
    callback: EventListenerCallback<DropMove>,
  );

  // App event dispatchers
  dispatch(source: string, type: 'load-topics', data: Topic[]): void;
  dispatch(source: string, type: 'load-drops', data: Drop[]): void;
  dispatch(source: string, type: 'insert-data', data: DataInsert[]): void;

  // Topic event dispatchers
  dispatch(source: string, type: SimpleTopicEventType, data: Topic): void;
  dispatch(source: string, type: 'update-topic', data: TopicChange): void;
  dispatch(source: string, type: 'move-topic', data: TopicMove): void;

  // Drop event dispatchers
  dispatch(source: string, type: SimpleDropEventType, data: Drop): void;
  dispatch(source: string, type: 'update-drop', data: DropChange): void;
  dispatch(source: string, type: 'move-drop', data: DropMove): void;
}

export interface App {
  // App event listeners
  addEventListener(
    type: 'load-topics',
    callback: EventListenerCallback<Topic[]>,
  );
  addEventListener(type: 'load-drops', callback: EventListenerCallback<Drop[]>);
  addEventListener(
    type: 'insert-data',
    callback: EventListenerCallback<DataInsert>,
  );

  // Topic event listeners
  addEventListener(
    type: SimpleTopicEventType,
    callback: EventListenerCallback<Topic>,
  );
  addEventListener(
    type: 'update-topic',
    callback: EventListenerCallback<TopicChange>,
  );
  addEventListener(
    type: 'move-topic',
    callback: EventListenerCallback<TopicMove>,
  );

  // Drop event listeners
  addEventListener(
    type: SimpleDropEventType,
    callback: EventListenerCallback<Drop>,
  );
  addEventListener(type: 'add-drop', callback: EventListenerCallback<DropAdd>);
  addEventListener(
    type: 'update-drop',
    callback: EventListenerCallback<DropChange>,
  );
  addEventListener(
    type: 'move-drop',
    callback: EventListenerCallback<DropMove>,
  );

  // App event dispatchers
  dispatch(type: 'load-topics', data: Topic[]): void;
  dispatch(type: 'load-drops', data: Drop[]): void;
  dispatch(type: 'insert-data', data: DataInsert[]): void;

  // Topic event dispatchers
  dispatch(type: SimpleTopicEventType, data: Topic): void;
  dispatch(type: 'update-topic', data: TopicChange): void;
  dispatch(type: 'move-topic', data: TopicMove): void;

  // Drop event dispatchers
  dispatch(type: SimpleDropEventType, data: Drop): void;
  dispatch(type: 'update-drop', data: DropChange): void;
  dispatch(type: 'move-drop', data: DropMove): void;
}
