import { awaitPendingDispatches } from '../PendingDispatchesStore';
import { cleanupEvents } from '../cleanupEvents';
import {
  AppErrorEvent,
  NavToolbarBackEvent,
  OpenConfirmationDialogEvent,
  OpenReferenceEvent,
  SetNavToolbarBackActionEvent,
  SetNavToolbarWidthEvent,
  ToggleWindowFillEvent,
} from '../core-events';
import { EventListenerNotRegisteredError } from '../errors';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  OpenConfirmationDialog: OpenConfirmationDialogEvent,
  SetNavToolbarWidth: SetNavToolbarWidthEvent,
  SetNavToolbarBackAction: SetNavToolbarBackActionEvent,
  NavToolbarBack: NavToolbarBackEvent,
  ToggleWindowFill: ToggleWindowFillEvent,
  AppError: AppErrorEvent,
  OpenReference: OpenReferenceEvent,
} as const;

export const errors = {
  ListenerNotRegistered: EventListenerNotRegisteredError,
};

/**
 * Test-only helpers.
 */
export const tests = {
  awaitAllListeners: awaitPendingDispatches,
  cleanup: cleanupEvents,
};

export {
  addEventListener as addListener,
  addEventListener as on,
} from '../addEventListener';
export { addEventListeners as addListeners } from '../addEventListeners';
export { dispatchEvent as dispatch } from '../dispatchEvent';
export { hasEventListener as hasListener } from '../hasEventListener';
export { removeEventListener as removeListener } from '../removeEventListener';
export { useEventLogEntries as useLogs } from '../useEventLogEntries';
