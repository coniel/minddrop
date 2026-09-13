import { Designs } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  NumberField,
  RadioToggleGroup,
  Stack,
  Toggle,
  ToolbarHoverPanel,
} from '@minddrop/ui-primitives';
import './FontSizeControl.css';

export interface FontSizeControlProps {
  /**
   * The size the text is set at, in pixels.
   */
  value: number;

  /**
   * Callback fired with the chosen size.
   */
  onValueChange: (fontSize: number) => void;
}

// The sizes a row of the ladder holds
const LadderColumns = 4;

/**
 * The ladder grid. Laid out inline so the column count wins over
 * the group's own single row.
 */
const LadderLayout: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${LadderColumns}, auto)`,
};

/**
 * Renders the picker for the size text is set at, opened out of the
 * toolbar: a ladder of the conventional sizes with a stepper field
 * beneath it for any other. The trigger shows the size it sets.
 */
export const FontSizeControl: React.FC<FontSizeControlProps> = ({
  value,
  onValueChange,
}) => {
  const { t } = useTranslation();

  // Sets the text at a ladder size
  function handleLadderChange(chosenValue: string) {
    onValueChange(Number(chosenValue));
  }

  // Sets the text at a size off the ladder, a cleared field leaving
  // the size as it is.
  function handleCustomSizeChange(fontSize: number | null) {
    if (fontSize !== null) {
      onValueChange(fontSize);
    }
  }

  return (
    <ToolbarHoverPanel
      label={t('designsNext.settings.fontSize.label')}
      trigger={<span className="design-font-size-control-value">{value}</span>}
    >
      <Stack gap={2} className="design-font-size-control-panel">
        <RadioToggleGroup
          size="sm"
          value={String(value)}
          style={LadderLayout}
          onValueChange={handleLadderChange}
        >
          {Designs.constants.FontSizes.map((fontSize) => (
            <Toggle
              key={fontSize}
              size="sm"
              value={String(fontSize)}
              label={String(fontSize)}
            />
          ))}
        </RadioToggleGroup>
        <NumberField
          size="sm"
          variant="subtle"
          stepper="ends"
          label="designsNext.settings.fontSize.custom"
          value={value}
          min={Designs.constants.MinFontSize}
          max={Designs.constants.MaxFontSize}
          onValueChange={handleCustomSizeChange}
        />
      </Stack>
    </ToolbarHoverPanel>
  );
};
