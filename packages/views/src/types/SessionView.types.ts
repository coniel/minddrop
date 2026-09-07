import { SubviewDescriptor } from './Subview.types';

/**
 * The view shown in a session pane, as persisted with the session:
 * the view type and instance, its props, and the metadata the tab and
 * breadcrumb trail label it by.
 */
export interface SessionView {
  /**
   * Identifier for the view type, following the convention
   * `[package]:view:[name]`.
   */
  view: string;

  /**
   * Unique id for this view instance, used to match the view for
   * updates or closing.
   */
  id?: string;

  /**
   * Props passed to the view component.
   */
  props?: unknown;

  /**
   * The view's display title, when it is the title of the entity it
   * shows. Views with a static label leave this unset and are
   * labelled from their registration.
   */
  title?: string;

  /**
   * The view's content icon as a serializable icon string, when it
   * is the icon of the entity it shows. Views with a fixed icon leave
   * it unset and are iconed from their registration.
   */
  contentIcon?: string;

  /**
   * The entity the view shows within itself, which labels the session
   * and extends the view's breadcrumb trail.
   */
  subview?: SubviewDescriptor;

  /**
   * Whether the view was opened from outside a view area, making it
   * the start of a new breadcrumb trail regardless of its breadcrumb
   * level.
   */
  startsTrail?: boolean;
}
