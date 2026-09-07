import {
  DefaultSplitRatio,
  DefaultViewAreaId,
  DefaultViewName,
} from './constants';
import {
  CloseViewEvent,
  NavigateBackEvent,
  OpenViewEvent,
  SetSubviewEvent,
  SetViewAreaEvent,
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
