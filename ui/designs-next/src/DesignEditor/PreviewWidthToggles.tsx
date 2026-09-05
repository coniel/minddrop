import { useTranslation } from '@minddrop/i18n';
import {
  FloatingToolbar,
  RadioToggleGroup,
  Toggle,
} from '@minddrop/ui-primitives';

export interface PreviewWidthTogglesProps {
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
 * The preview widths offered, in pixels, with their labels and the
 * abbreviations shown on the toggles. Regular matches the design's
 * own width, so the preview and the editor match at 100%.
 */
export const PreviewWidthPresets = [
  {
    width: 240,
    label: 'designsNext.editor.widths.narrow',
    shortLabel: 'designsNext.editor.widths.narrowShort',
  },
  {
    width: 384,
    label: 'designsNext.editor.widths.regular',
    shortLabel: 'designsNext.editor.widths.regularShort',
  },
  {
    width: 560,
    label: 'designsNext.editor.widths.wide',
    shortLabel: 'designsNext.editor.widths.wideShort',
  },
  {
    width: 800,
    label: 'designsNext.editor.widths.extraWide',
    shortLabel: 'designsNext.editor.widths.extraWideShort',
  },
] as const;

/**
 * Renders the card preview width toggles as a floating toolbar.
 */
export const PreviewWidthToggles: React.FC<PreviewWidthTogglesProps> = ({
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
        {PreviewWidthPresets.map((preset) => (
          <Toggle
            key={preset.width}
            size="sm"
            value={String(preset.width)}
            label={t(preset.label)}
            tooltip={{
              stringTitle: t('designsNext.editor.previewWidth', {
                width: `${preset.width}px`,
              }),
            }}
          >
            {t(preset.shortLabel)}
          </Toggle>
        ))}
      </RadioToggleGroup>
    </FloatingToolbar>
  );
};
