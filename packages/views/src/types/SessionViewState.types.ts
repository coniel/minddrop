/**
 * A pane's transient UI state (scroll positions, selections),
 * keyed by scoped state key. Values must be JSON-serializable.
 */
export type TransientViewState = Record<string, unknown>;

/**
 * The transient UI state of a session's panes.
 */
export interface SessionViewState {
  /**
   * The main pane's transient state.
   */
  main?: TransientViewState;

  /**
   * The split pane's transient state.
   */
  split?: TransientViewState;
}
