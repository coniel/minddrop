import { ContentWidth, Designs } from '@minddrop/designs-next';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  Icon,
  InputLabel,
  RadioToggleGroup,
  Stack,
  Toggle,
  ToolbarHoverPanel,
} from '@minddrop/ui-primitives';
import { NumberLadder } from '../NumberLadder';
import { PaddingScaleColumns } from '../constants';
import { usePaddingLadderOptions } from '../usePaddingLadderOptions';
import './ContentWidthControl.css';

export interface ContentWidthControlProps {
  /**
   * The design's content width, or undefined for full width.
   */
  contentWidth?: ContentWidth;

  /**
   * The design's side padding in pixels, or undefined for none.
   */
  sidePadding?: number;

  /**
   * Callback fired with the picked content width, or null for full
   * width.
   */
  onContentWidthChange: (contentWidth: ContentWidth | null) => void;

  /**
   * Callback fired with the picked side padding in pixels.
   */
  onSidePaddingChange: (sidePadding: number) => void;
}

// A content width toggle option: a reading width, or full width
type ContentWidthOption = ContentWidth | 'full';

// The toggle value standing for full width
const FullWidth = 'full';

// The content width options in display order, full width last
const ContentWidthOptions: ContentWidthOption[] = [
  ...Designs.constants.ContentWidths,
  FullWidth,
];

const contentWidthKey = createI18nKeyBuilder('designsNext.contentWidth.');

/**
 * Renders the content width and side padding picker, opened out of
 * the toolbar.
 */
export const ContentWidthControl: React.FC<ContentWidthControlProps> = ({
  contentWidth,
  sidePadding,
  onContentWidthChange,
  onSidePaddingChange,
}) => {
  const { t } = useTranslation();
  const paddingOptions = usePaddingLadderOptions();

  // Reports the picked width, full width as null
  function handleWidthChange(picked: string) {
    onContentWidthChange(Designs.isContentWidth(picked) ? picked : null);
  }

  // Resolves an option's tooltip description
  function resolveDescription(option: ContentWidthOption): string {
    // Full width has a description of its own
    if (option === FullWidth) {
      return t(contentWidthKey('fullDescription'));
    }

    // Describe a cap by its pixel width
    return t(contentWidthKey('capDescription'), {
      width: `${
        Designs.constants.ContentWidthColumns[option] *
        Designs.constants.UnitPixelSize
      }px`,
    });
  }

  return (
    <ToolbarHoverPanel
      label={t(contentWidthKey('label'))}
      trigger={<Icon name="ruler-dimension-line" />}
    >
      <Stack gap={3} className="design-content-width-control-panel">
        {/* Content width toggles */}
        <Stack gap={1}>
          <InputLabel size="xs" label="designsNext.contentWidth.label" />
          <RadioToggleGroup
            size="sm"
            value={contentWidth ?? FullWidth}
            className="design-content-width-control-widths"
            onValueChange={handleWidthChange}
          >
            {ContentWidthOptions.map((option) => (
              <Toggle
                key={option}
                size="sm"
                value={option}
                label={t(contentWidthKey(option))}
                tooltip={{ stringTitle: resolveDescription(option) }}
              >
                {t(contentWidthKey(option))}
              </Toggle>
            ))}
          </RadioToggleGroup>
        </Stack>
        {/* Side padding ladder */}
        <NumberLadder
          label="designsNext.sidePadding.label"
          hideCustomLabel
          options={paddingOptions}
          columns={PaddingScaleColumns}
          value={sidePadding ?? 0}
          min={0}
          max={Designs.constants.MaxSidePadding}
          onValueChange={onSidePaddingChange}
        />
      </Stack>
    </ToolbarHoverPanel>
  );
};
