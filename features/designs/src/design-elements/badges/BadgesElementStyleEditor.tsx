import { useCallback } from 'react';
import { DefaultBadgesElementStyle } from '@minddrop/designs';
import { Stack, SwitchField } from '@minddrop/ui-primitives';
import { updateElementStyle, useElementStyle } from '../../DesignStudioStore';
import { Border } from '../../style-editors/Border';
import { BorderRadiusField } from '../../style-editors/BorderRadiusField';
import { CollapsibleSection } from '../../style-editors/CollapsibleSection';
import { MarginFields } from '../../style-editors/MarginFields';
import { PaddingFields } from '../../style-editors/PaddingFields';
import { SectionLabel } from '../../style-editors/SectionLabel';
import { Typography } from '../../style-editors/Typography';
import { BadgesPlaceholderField } from './BadgesPlaceholderField';

export interface BadgesElementStyleEditorProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

// Default values for the padding collapsible section
const paddingDefaults = {
  paddingTop: DefaultBadgesElementStyle.paddingTop,
  paddingRight: DefaultBadgesElementStyle.paddingRight,
  paddingBottom: DefaultBadgesElementStyle.paddingBottom,
  paddingLeft: DefaultBadgesElementStyle.paddingLeft,
} as const;

// Default values for the radius collapsible section
const radiusDefaults = {
  borderRadiusTopLeft: DefaultBadgesElementStyle.borderRadiusTopLeft,
  borderRadiusTopRight: DefaultBadgesElementStyle.borderRadiusTopRight,
  borderRadiusBottomRight: DefaultBadgesElementStyle.borderRadiusBottomRight,
  borderRadiusBottomLeft: DefaultBadgesElementStyle.borderRadiusBottomLeft,
  round: DefaultBadgesElementStyle.round,
} as const;

// Default values for the border collapsible section
const borderDefaults = {
  borderStyle: DefaultBadgesElementStyle.borderStyle,
  borderWidth: DefaultBadgesElementStyle.borderWidth,
} as const;

// Default values for the typography collapsible section
const typographyDefaults = {
  'font-family': DefaultBadgesElementStyle['font-family'],
  'font-weight': DefaultBadgesElementStyle['font-weight'],
  color: DefaultBadgesElementStyle.color,
  opacity: DefaultBadgesElementStyle.opacity,
} as const;

// Default values for the margin collapsible section
const marginDefaults = {
  'margin-top': DefaultBadgesElementStyle['margin-top'],
  'margin-right': DefaultBadgesElementStyle['margin-right'],
  'margin-bottom': DefaultBadgesElementStyle['margin-bottom'],
  'margin-left': DefaultBadgesElementStyle['margin-left'],
} as const;

/**
 * Renders the style editor panel for badges design elements.
 * Provides placeholder, padding, radius, typography, and margin controls.
 */
export const BadgesElementStyleEditor: React.FC<
  BadgesElementStyleEditorProps
> = ({ elementId }) => {
  const round = useElementStyle(elementId, 'round');

  const handleRoundChange = useCallback(
    (checked: boolean) => {
      updateElementStyle(elementId, 'round', checked);
    },
    [elementId],
  );

  return (
    <>
      <Stack gap={3}>
        <SectionLabel label="designs.badges.placeholder.label" />
        <BadgesPlaceholderField elementId={elementId} />
      </Stack>

      <CollapsibleSection
        elementId={elementId}
        label="designs.typography.label"
        defaultStyles={typographyDefaults}
      >
        <Typography
          elementId={elementId}
          hideColor
          hideLineHeight
          hideTextAlign
          hideMaxWidth
        />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.padding.label"
        defaultStyles={paddingDefaults}
      >
        <PaddingFields elementId={elementId} />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.radius.label"
        defaultStyles={radiusDefaults}
      >
        <div
          style={{
            opacity: round ? 0.4 : undefined,
            pointerEvents: round ? 'none' : undefined,
          }}
        >
          <BorderRadiusField elementId={elementId} />
        </div>
        <SwitchField
          size="md"
          label="designs.image.round.label"
          checked={round}
          onCheckedChange={handleRoundChange}
        />
      </CollapsibleSection>

      <CollapsibleSection
        elementId={elementId}
        label="designs.border.label"
        defaultStyles={borderDefaults}
      >
        <Border elementId={elementId} hideColor />
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
