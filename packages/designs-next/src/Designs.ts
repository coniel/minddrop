import {
  CardAspectRatios,
  ContentWidthColumns,
  ContentWidths,
  DefaultFontSize,
  DefaultLineHeight,
  DefaultTextColor,
  DesignElementGroups,
  DesignEntityType,
  DesignTypeColumns,
  DesignTypeIcons,
  DesignTypeRows,
  DesignTypeSnaps,
  DesignsIcon,
  FontFamilies,
  FontSizes,
  FontWeights,
  LineHeightStep,
  LineHeights,
  MaxDesignRows,
  MaxElementPadding,
  MaxFontSize,
  MaxLineHeight,
  MaxSidePadding,
  MinDesignRows,
  MinFontSize,
  MinLineHeight,
  PaddingScale,
  PaddingSides,
  PaddingSizes,
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
  EntityType: DesignEntityType,
  Icon: DesignsIcon,
  TypeIcons: DesignTypeIcons,
  UnitPixelSize,
  TypeColumns: DesignTypeColumns,
  TypeRows: DesignTypeRows,
  MinRows: MinDesignRows,
  MaxRows: MaxDesignRows,
  CardAspectRatios,
  ContentWidths,
  ContentWidthColumns,
  MaxSidePadding,
  SnapPresets,
  TypeSnaps: DesignTypeSnaps,
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
  MaxPadding: MaxElementPadding,
  PaddingSides,
  PaddingScale,
  PaddingSizes,
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
export { unloadDesign as unload } from './unloadDesign';
export { readDesign as read } from './readDesign';
export { serializeDesign as serialize } from './serializeDesign';
export { setDesignContentWidth as setContentWidth } from './setDesignContentWidth';
export { updateDesign as update } from './updateDesign';
export { writeDesign as write } from './writeDesign';
export {
  useDesign as use,
  useDesigns as useAll,
  useDesignsByIds as useByIds,
  useDesignsOfType as useOfType,
} from './DesignsStore';
export {
  applyElementDrag,
  applyElementSettings,
  floorToMultiple,
  hasMappedPropertyType,
  hasNeighbourOnSide,
  isContentWidth,
  remapElementProperties,
  removeElement,
  resolveAspectRatioValue,
  resolveAspectRows,
  resolveChildElements,
  resolveElementColumnUnits,
  resolveElementRowUnits,
  resolveLayoutTree,
  resolvePaddingSize,
  resolveSlotElement,
  resolveTextLineRowSpan,
  snapToMultiple,
  unmapElementProperties,
  updateElement,
} from './utils';
