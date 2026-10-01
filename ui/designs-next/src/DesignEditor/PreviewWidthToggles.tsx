import { DesignType } from '@minddrop/designs-next';
import { useTranslation } from '@minddrop/i18n';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
} from '@minddrop/ui-primitives';

export interface PreviewWidthTogglesProps {
  /**
   * The preview widths offered, in pixels, from the narrowest to
   * the widest.
   */
  widths: number[];

  /**
   * The current preview width in pixels.
   */
  width: number;

  /**
   * Callback fired with the picked width.
   */
  onWidthChange: (width: number) => void;
}

/**
 * The preview widths offered per design type, in pixels, from the
 * narrowest to the widest. A card's regular width, the second,
 * matches its design width, so the preview and the editor match at
 * 100%.
 */
export const PreviewWidths: Record<DesignType, number[]> = {
  card: [240, 384, 560, 800],
  list: [240, 384, 560, 800],
  page: [640, 960, 1280, 1600],
  space: [640, 960, 1280, 1600],
};

// The labels of the preview widths and the abbreviations shown on
// the toggles, from the narrowest to the widest.
const PreviewWidthLabels = [
  {
    label: 'designsNext.editor.widths.narrow',
    shortLabel: 'designsNext.editor.widths.narrowShort',
  },
  {
    label: 'designsNext.editor.widths.regular',
    shortLabel: 'designsNext.editor.widths.regularShort',
  },
  {
    label: 'designsNext.editor.widths.wide',
    shortLabel: 'designsNext.editor.widths.wideShort',
  },
  {
    label: 'designsNext.editor.widths.extraWide',
    shortLabel: 'designsNext.editor.widths.extraWideShort',
  },
] as const;

/**
 * Renders the preview width toggles as a floating toolbar.
 */
export const PreviewWidthToggles: React.FC<PreviewWidthTogglesProps> = ({
  widths,
  width,
  onWidthChange,
}) => {
  const { t } = useTranslation();

  // Reports the picked width
  function handleValueChange(value: string) {
    onWidthChange(Number(value));
  }

  return (
    <FloatingToolbar size="md" visible>
      <RadioToggleGroup
        size="sm"
        value={String(width)}
        onValueChange={handleValueChange}
      >
        {PreviewWidthLabels.map((labels, index) => (
          <Toggle
            key={labels.label}
            size="sm"
            value={String(widths[index])}
            label={t(labels.label)}
            tooltip={{
              stringTitle: t('designsNext.editor.previewWidth', {
                width: `${widths[index]}px`,
              }),
            }}
          >
            {t(labels.shortLabel)}
          </Toggle>
        ))}
      </RadioToggleGroup>
    </FloatingToolbar>
  );
};
