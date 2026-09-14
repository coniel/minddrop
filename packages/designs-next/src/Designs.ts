import {
  CardAspectRatios,
  DefaultFontSize,
  DefaultLineHeight,
  DefaultTextColor,
  DesignElementGroups,
  DesignTypeIcons,
  DesignsIcon,
  FontFamilies,
  FontSizes,
  FontWeights,
  LineHeightStep,
  LineHeights,
  MaxDesignRows,
  MaxFontSize,
  MaxLineHeight,
  MinDesignRows,
  MinFontSize,
  MinLineHeight,
  SnapPresets,
  UnitPixelSize,
} from './constants';
import { DesignNotFoundError } from './errors';
import {
  DesignCreatedEvent,
  DesignDeletedEvent,
  DesignUpdatedEvent,
  DesignsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: DesignCreatedEvent,
  Updated: DesignUpdatedEvent,
  Deleted: DesignDeletedEvent,
  Loaded: DesignsLoadedEvent,
} as const;

export const errors = {
  NotFound: DesignNotFoundError,
};

export const constants = {
  Icon: DesignsIcon,
  TypeIcons: DesignTypeIcons,
  UnitPixelSize,
  MinRows: MinDesignRows,
  MaxRows: MaxDesignRows,
  CardAspectRatios,
  SnapPresets,
  ElementGroups: DesignElementGroups,
  FontFamilies,
  FontWeights,
  FontSizes,
  DefaultFontSize,
  MinFontSize,
  MaxFontSize,
  LineHeights,
  DefaultLineHeight,
  MinLineHeight,
  MaxLineHeight,
  LineHeightStep,
  DefaultTextColor,
};

export { DesignsStore as Store } from './DesignsStore';
export { createDesign as create } from './createDesign';
export { createDesignElement as createElement } from './createDesignElement';
export { deleteDesign as delete } from './deleteDesign';
export { duplicateDesign as duplicate } from './duplicateDesign';
export { getDesign as get } from './getDesign';
export { getOwnedDesigns as getByOwner } from './getOwnedDesigns';
export { initializeDesigns as initialize } from './initializeDesigns';
export { loadWorkspaceDesigns as loadWorkspace } from './loadWorkspaceDesigns';
export { loadDesigns as load } from './loadDesigns';
export { readDesign as read } from './readDesign';
export { serializeDesign as serialize } from './serializeDesign';
export { updateDesign as update } from './updateDesign';
export { writeDesign as write } from './writeDesign';
export {
  useDesign as use,
  useDesigns as useAll,
  useDesignsOfType as useOfType,
} from './DesignsStore';
export {
  applyElementDrag,
  applyElementSettings,
  floorToMultiple,
  hasNeighbourOnSide,
  resolveAspectRatioValue,
  resolveAspectRows,
  resolveElementRect,
  resolveRowLayout,
  resolveTextLineRowSpan,
  resolveVerticalElementRect,
  snapToMultiple,
} from './utils';
