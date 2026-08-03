export interface View {
  /**
   * A unique identifier for the view, matching the `view` field of an
   * `OpenViewEvent`. Follows the convention `[package]:view:[name]`.
   */
  type: string;

  /**
   * The component rendered for this view.
   */
  component: React.ComponentType<any>;
}
