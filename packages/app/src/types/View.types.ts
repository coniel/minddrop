import { Breadcrumb } from '@minddrop/core';
import { AppCore } from './AppCore.types';

export interface View {
  /**
   * Unique ID used to open the view.
   */
  id: string;

  /**
   * Breadcrumbs leading up to and including the view.
   */
  breadcrumbs?: Breadcrumb[];

  /**
   * ID of the resource to be displayed by the view.
   */
  resource?: string;
}

export interface ViewProps {
  /**
   * App API with which the view can interact with the app.
   */
  app: AppCore;

  /**
   * Breadcrumbs leading up to and including the view.
   */
  breadcrumbs?: Breadcrumb[];
}

export interface ResourceViewProps extends ViewProps {
  /**
   * ID of the resource to be displayed by the view.
   */
  resource: string;
}

export interface ResourceView extends View {
  /**
   * ID of the resource to be displayed by the view.
   */
  resource: string;
}
