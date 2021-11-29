import { Topic } from '@minddrop/topic';
import { Drop } from '@minddrop/drop';
import { DataInsert } from '@minddrop/core';
import { CreateTagEventData as BaseCreateTagEventData } from '@minddrop/tag';
import { View, ResourceView } from './View.types';

export type LoadTopicsEvent = 'load-topics';
export type LoadDropsEvent = 'load-drops';
export type OpenViewEvent = 'open-view';
export type InsertDataEvent = 'insert-data';
export type MoveDropEvent = 'move-drop';
export type AddDropEvent = 'add-drop';

export type LoadTopicsEventData = Topic[];
export type LoadDropsEventData = Drop[];
export type OpenViewEventData = View | ResourceView;
export type InsertDataEventData = DataInsert;

export interface MoveDropEventData {
  /**
   * The ID of the topic from which the drop is being moved.
   */
  from: string;

  /**
   * The ID of the topic to which the drop is being moved.
   */
  to: string;

  /**
   * The drop being moved.
   */
  drop: Drop;
}

export interface AddDropEventData {
  /**
   * The ID of the topic to which the drop is being added.
   */
  to: string;

  /**
   * The drop being added.
   */
  drop: Drop;
}

export interface CreateTagEventData extends BaseCreateTagEventData {
  /**
   * `true` if the tag appears at the root level.
   */
  root: boolean;

  /**
   * The ID of the parent topic.
   */
  parent?: string;
}
