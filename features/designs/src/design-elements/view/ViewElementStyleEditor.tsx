import { useCallback } from 'react';
import { DefaultViewElementStyle, ViewElement } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { Select, SelectItem, Stack } from '@minddrop/ui-primitives';
import { ViewTypes } from '@minddrop/views';
import { updateDesignElement, useElementData } from '../../DesignStudioStore';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { SizingFields } from '../../style-editors/SizingFields';
import { FlatViewElement } from '../../types';
import { BackgroundColorSelect } from '../container/BackgroundColorSelect';

export interface ViewElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the background collapsible section
const backgroundDefaults = {
  backgroundColor: DefaultViewElementStyle.backgroundColor,
} as const;

// Default values for the sizing collapsible section
const sizingDefaults = {
  width: DefaultViewElementStyle.width,
  height: DefaultViewElementStyle.height,
  maxWidth: DefaultViewElementStyle.maxWidth,
  maxHeight: DefaultViewElementStyle.maxHeight,
} as const;

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultViewElementStyle.borderStyle,
  borderColor: DefaultViewElementStyle.borderColor,
  borderWidth: DefaultViewElementStyle.borderWidth,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultViewElementStyle.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultViewElementStyle.borderRadiusTopRight,
  borderRadiusBottomRight: DefaultViewElementStyle.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultViewElementStyle.borderRadiusBottomLeft,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultViewElementStyle['margin-top'],
  'margin-right': DefaultViewElementStyle['margin-right'],
  'margin-bottom': DefaultViewElementStyle['margin-bottom'],
  'margin-left': DefaultViewElementStyle['margin-left'],
} as const;

/**
 * Renders the style editor panel for view design elements.
 * Provides sizing, border, opacity, and margin controls.
 */
export const ViewElementStyleEditor: React.FC<ViewElementStyleEditorProps> = ({
  elementId,
}) => {
  const { t } = useTranslation();
  const viewTypes = ViewTypes.useAll();
  const { viewType } = useElementData<FlatViewElement, { viewType: string }>(
    elementId,
    (element) => ({ viewType: element.viewType }),
  );

  const handleViewTypeChange = useCallback(
    (value: string) => {
      updateDesignElement<ViewElement>(elementId, { viewType: value });
    },
    [elementId],
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.view.viewType.label" />
        <Select
          variant="subtle"
          size="md"
          value={viewType}
          onValueChange={handleViewTypeChange}
          options={viewTypes.map((type) => ({
            label: t(type.name),
            value: type.type,
          }))}
        >
          {viewTypes.map((type) => (
            <SelectItem key={type.type} label={type.name} value={type.type} />
          ))}
        </Select>
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.background-color.label"
        defaultStyles={backgroundDefaults}
      >
        <BackgroundColorSelect elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.image.sizing.label"
        defaultStyles={sizingDefaults}
      >
        <SizingFields elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.label"
        defaultStyles={borderDefaults}
      >
        <Border elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <BorderRadiusField elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.margin.label"
        defaultStyles={marginDefaults}
      >
        <MarginFields elementId={elementId} />
      </CollapsibleSection>
    </>
  );
};
