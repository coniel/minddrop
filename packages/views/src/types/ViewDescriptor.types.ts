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
   * Descriptors of the view's ancestor views, ordered root first.
   * Rendered as a breadcrumb trail by the opened view. Breadcrumb
   * descriptors never carry their own trails.
   */
  breadcrumbs?: ViewDescriptor[];
};
