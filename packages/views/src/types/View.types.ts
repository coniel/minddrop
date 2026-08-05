export interface View {
  /**
   * A unique identifier for the view, matching the `view` field of an
   * `OpenViewEvent`. Follows the convention `[package]:view:[name]`.
   */
  type: string;

  /**
   * The component rendered for this view.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- must accept components with arbitrary props
  component: React.ComponentType<any>;
}
