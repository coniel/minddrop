import type { SubviewDescriptor } from './Subview.types';

/**
 * The default props type for view payloads.
 *
 * `any` rather than `unknown` so that consumers can read props off a view
 * without narrowing first. Views that care about their props supply their
 * own type argument.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DefaultViewProps = any;

export type ViewDescriptor<TProps = DefaultViewProps> = {
  /**
   * Identifier for the view type, following the convention
   * `[package]:view:[name]`. The component is resolved from the
   * registered views.
   */
  view: string;

  /**
   * Unique id for this view instance, used to match the view for
   * later updates or closing.
   */
  id?: string;

  /**
   * Props passed to the view component.
   */
  props?: TProps;

  /**
   * Display title for the view, shown in its tab.
   */
  title?: string;

  /**
   * Display icon for the view as a serializable icon string, shown
   * in its tab.
   */
  icon?: string;

  /**
   * The entity the view currently shows within itself, which labels
   * the view's tab and extends its breadcrumb trail. Changing it is
   * a navigation, so views can be navigated back and forward through.
   */
  subview?: SubviewDescriptor;

  /**
   * Whether the view was opened from outside a view area (e.g. the
   * app sidebar), making it the start of a new breadcrumb trail
   * regardless of its breadcrumb level.
   */
  startsTrail?: boolean;
};
