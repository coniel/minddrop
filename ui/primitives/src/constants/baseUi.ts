/**
 * Attributes Base UI marks its own elements with, which consumers
 * have to recognise: popup surfaces render in a portal outside the
 * element that opened them, and an open trigger is wrapped in focus
 * guards which sit among its siblings without being controls.
 */
export const BaseUiPortalAttribute = 'data-base-ui-portal';
export const BaseUiFocusGuardAttribute = 'data-base-ui-focus-guard';
