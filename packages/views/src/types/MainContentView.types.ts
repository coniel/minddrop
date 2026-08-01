export interface MainContentView {
  /**
   * A unique identifier for the view, matching the `view` field of an
   * `OpenMainContentViewEvent`. Follows the convention `[package]:view:[name]`.
   */
  type: string;

  /**
   * The component rendered in the main content area for this view.
   */
  component: React.ComponentType<any>;
}
