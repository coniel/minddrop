import { DesignElementStyle } from '@minddrop/designs';
import { InputLabel, Stack } from '@minddrop/ui-primitives';
import { updateElementStyle } from '../DesignStudioStore';
import { BorderColorSelect } from './BorderColorSelect';
import { BorderStyleToggle } from './BorderStyleToggle';
import { BorderWidthFields } from './BorderWidthFields';
import { CollapsibleSection } from './CollapsibleSection';

export interface BorderProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;

  /**
   * Default border style values used to detect non-default state
   * and reset when the section is closed.
   */
  defaultStyles: Partial<Record<keyof DesignElementStyle, unknown>>;

  /**
   * Whether to hide the border color select.
   * @default false
   */
  hideColor?: boolean;
}

/**
 * Renders a collapsible border section with style, width, and color controls.
 */
export const Border: React.FC<BorderProps> = ({
  elementId,
  defaultStyles,
  hideColor = false,
}) => {
  return (
    <CollapsibleSection
      elementId={elementId}
      label="designs.border.label"
      defaultStyles={defaultStyles}
      onOpen={() => updateElementStyle(elementId, 'borderStyle', 'solid')}
    >
      <BorderStyleToggle elementId={elementId} />
      {!hideColor && (
        <BorderColorSelect
          elementId={elementId}
          label="designs.border.color.label"
        />
      )}
      <Stack gap={1}>
        <InputLabel size="xs" label="designs.border.width.label" />
        <BorderWidthFields elementId={elementId} />
      </Stack>
    </CollapsibleSection>
  );
};
