import { DesignTypeLayoutTypes, DesignsIcon, MediaDirName } from './constants';
import {
  ContainerElementConfig,
  DataViewElementConfig,
  PropertyElementTypeConfig,
  TextElementConfig,
} from './design-element-configs';
import { DesignNotFoundError } from './errors';
import {
  DesignCreatedEvent,
  DesignDeletedEvent,
  DesignPropertyRenamedEvent,
  DesignUpdatedEvent,
  DesignsLoadedEvent,
} from './events';
import {
  AspectRatios,
  BackdropBlurs,
  BackdropTintStrengths,
  BackdropTints,
  BackgroundEmphases,
  BorderEmphases,
  DefaultContainerStyle,
  LandscapeAspectRatios,
  PortraitAspectRatios,
} from './styles';
import {
  BorderWidthTokens,
  FontFamilyTokens,
  FontSizeTokens,
  FontWeightTokens,
  IconSizeTokens,
  LetterSpacingTokens,
  LineHeightTokens,
  RadiusTokens,
  SizeTokens,
  TextColorTokens,
} from './tokens';

// Const-asserted so the names keep their literal types, which key
// the event data registry
export const events = {
  Created: DesignCreatedEvent,
  Updated: DesignUpdatedEvent,
  Deleted: DesignDeletedEvent,
  Loaded: DesignsLoadedEvent,
  PropertyRenamed: DesignPropertyRenamedEvent,
} as const;

export const errors = {
  NotFound: DesignNotFoundError,
};

export const constants = {
  MediaDirName,
  Icon: DesignsIcon,
  TypeLayoutTypes: DesignTypeLayoutTypes,
};

export const tokens = {
  BorderWidth: BorderWidthTokens,
  FontFamily: FontFamilyTokens,
  FontSize: FontSizeTokens,
  FontWeight: FontWeightTokens,
  IconSize: IconSizeTokens,
  LetterSpacing: LetterSpacingTokens,
  LineHeight: LineHeightTokens,
  Radius: RadiusTokens,
  Size: SizeTokens,
  TextColor: TextColorTokens,
};

export const styles = {
  AspectRatios,
  PortraitAspectRatios,
  LandscapeAspectRatios,
  BackdropBlurs,
  BackdropTints,
  BackdropTintStrengths,
  BackgroundEmphases,
  BorderEmphases,
  DefaultContainerStyle,
};

export const elementConfigs = {
  Text: TextElementConfig,
  Container: ContainerElementConfig,
  DataView: DataViewElementConfig,
  Property: PropertyElementTypeConfig,
};

export { DesignsStore as Store } from './DesignsStore';
export { addDesignProperty as addProperty } from './addDesignProperty';
export { createDesign as create } from './createDesign';
export { createVirtualDesign as createVirtual } from './createVirtualDesign';
export { deleteDesign as delete } from './deleteDesign';
export { getDesign as get } from './getDesign';
export { initializeDesigns as initialize } from './initializeDesigns';
export { loadVirtualDesigns as loadVirtual } from './loadVirtualDesigns';
export { readDesign as read } from './readDesign';
export { removeDesignProperty as removeProperty } from './removeDesignProperty';
export { renameDesignProperty as renameProperty } from './renameDesignProperty';
export { updateDesignProperty as updateProperty } from './updateDesignProperty';
export { updateDesign as update } from './updateDesign';
export { writeDesign as write } from './writeDesign';
export {
  useDesign as use,
  useDesigns as useAll,
  useDesignsOfType as useOfType,
} from './DesignsStore';
export { createElement } from './createElement';
export { createPropertyElement } from './createPropertyElement';
export {
  getElementConfig,
  getElementConfigs,
  generateBadgePlaceholder,
  generateLoremIpsum,
  generateNumberPlaceholder,
  generatePropertyPlaceholder,
} from './design-element-configs';
export {
  getPropertyElementConfig,
  getPropertyElementConfigs,
} from './property-element-configs';
export {
  createElementCssStyle,
  createBackdropCss,
  createBadgeCss,
  createEditorTitleCss,
  createFieldCss,
  createIconContainerCss,
  createPropertyIconCss,
  createPropertyLabelCss,
  createTypographyCss,
  contentColumnCss,
} from './createElementCssStyle';
export { tokenCssVariable } from './tokens';
export {
  isRoleElement,
  isPropertyElement,
  isEditorVariantElement,
  supportsPropertyChrome,
  resolveElementStyle,
  resolvePropertyElementStyle,
  getPropertyElementVariant,
  getElementCompatiblePropertyTypes,
  getElementStyleCategory,
  resolveAutoBinding,
  resolveDesignMediaDirPath as resolveMediaDirPath,
  elementTitleBindingId,
  isEmptyPropertyValue,
  defaultRootStyle,
} from './utils';
