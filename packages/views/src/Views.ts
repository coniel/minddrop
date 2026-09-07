import {
  DefaultSplitRatio,
  DefaultViewAreaId,
  DefaultViewName,
} from './constants';
import {
  ClearSlotEvent,
  CloseViewEvent,
  NavigateBackEvent,
  OpenViewEvent,
  SetSlotEvent,
  SetSubviewEvent,
  SetViewAreaEvent,
  ToggleSlotEvent,
  UpdateViewEvent,
  ViewAreaChangedEvent,
  ViewAreaReadyEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Open: OpenViewEvent,
  Update: UpdateViewEvent,
  Close: CloseViewEvent,
  NavigateBack: NavigateBackEvent,
  SetSubview: SetSubviewEvent,
  SetArea: SetViewAreaEvent,
  AreaChanged: ViewAreaChangedEvent,
  AreaReady: ViewAreaReadyEvent,
  SetSlot: SetSlotEvent,
  ToggleSlot: ToggleSlotEvent,
  ClearSlot: ClearSlotEvent,
} as const;

export const constants = {
  DefaultAreaId: DefaultViewAreaId,
  DefaultName: DefaultViewName,
  DefaultSplitRatio,
};

export {
  ViewsStore as Store,
  useView as use,
  useViews as useAll,
} from './ViewsStore';
export { registerView as register } from './registerView';
export { getView as get } from './getView';
export {
  SlotFillsStore as FillsStore,
  useSlotFill as useFill,
  useSlotFills as useFills,
} from './SlotFillsStore';
export { registerFill } from './registerFill';
export { getFill } from './getFill';
export { useSlot } from './useSlot';
export { useSlotState } from './useSlotState';
export {
  ViewBreadcrumbsProvider as BreadcrumbsProvider,
  useViewBreadcrumbs as useBreadcrumbs,
} from './ViewBreadcrumbsContext';
export {
  ViewPaneProvider as PaneProvider,
  useOpenView,
  useViewPane,
} from './ViewPaneContext';
export {
  ViewSessionProvider as SessionProvider,
  useViewSession as useSession,
} from './ViewSessionContext';
export { SubviewProvider, useSubview, useSetSubview } from './SubviewContext';
