import { Core } from '@minddrop/core';

export interface ViewResource {
  /**
   * The resource type.
   */
  type: string;

  /**
   * The ID of the resource.
   */
  id: string;
}

export interface View {
  /**
   * Unique ID used to open the view.
   */
  id: string;

  /**
   * The name of the view or the name of the resource
   * rendered by the view.
   */
  title: string;

  /**
   * Breadcrumbs leading up to and including the view.
   */
  breadcrumbs?: View[];

  /**
   * The resource to be displayed by the view.
   */
  resource?: ViewResource;
}

export interface ResourceView extends View {
  /**
   * The resource to be displayed by the view.
   */
  resource: ViewResource;
}

export interface ViewProps {
  /**
   * A MindDrop core instance.
   */
  core: Core;

  /**
   * Breadcrumbs leading up to and including the view.
   */
  breadcrumbs?: View[];

  /**
   * The resource to be displayed by the view.
   */
  resource?: ViewResource;
}
