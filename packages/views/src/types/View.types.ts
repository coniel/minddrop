import { Core, DataInsert } from '@minddrop/core';
import { ComponentType } from 'react';
import { ViewInstance } from './ViewInstance.types';

export interface BaseView {
  /**
   * The unique ID of the view.
   */
  id: string;

  /**
   * The ID of the extension that registered the view.
   */
  extension: string;

  /**
   * The type of view.
   * - `static` views simply render the provided component.
   * - `instance` views are rendered using a persistently
   *    stored view document passed in to the component.
   */
  type: 'static' | 'instance';

  /**
   * Called when data is inserted into the view, usually in
   * the from of a drag and drop or paste event.
   *
   * @param core A MindDrop core instance.
   * @param data The inserted data.
   * @param viewInstance The view instance into which the data was inserterted if the view is an instance view.
   */
  onInsertData?(
    core: Core,
    data: DataInsert,
    viewInstance?: ViewInstance,
  ): void;
}

export interface StaticView extends BaseView {
  /**
   * The type of view.
   */
  type: 'static';

  /**
   * The component rendered by the view.
   */
  component: ComponentType;
}

export interface InstanceViewProps {
  /**
   * The ID of the view instance.
   */
  instanceId: string;
}

export interface InstanceView extends BaseView {
  /**
   * The type of view.
   */
  type: 'instance';

  /**
   * The component rendered by the view.
   */
  component: ComponentType<InstanceViewProps>;
}

export type View = StaticView | InstanceView;
