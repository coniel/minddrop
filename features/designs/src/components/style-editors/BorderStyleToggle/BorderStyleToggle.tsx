import { useCallback } from 'react';
import { BorderStyle, borderStyles } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BorderStyleToggleProps {
  elementId: string;
}

const svgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
};

const borderStyleIcons: Record<BorderStyle, React.ReactNode> = {
  none: null,
  solid: (
    <svg {...svgProps} strokeWidth={2}>
      <line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  ),
  dashed: (
    <svg {...svgProps} strokeWidth={2}>
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray="4 3" />
    </svg>
  ),
  dotted: (
    <svg {...svgProps} strokeWidth={2}>
      <line x1="2" y1="8" x2="14" y2="8" strokeDasharray="1.5 3" />
    </svg>
  ),
};

export const BorderStyleToggle = ({ elementId }: BorderStyleToggleProps) => {
  const { t } = useTranslation();
  const borderStyle = useElementStyle(elementId, 'borderStyle');

  const handleSelect = useCallback(
    (value: BorderStyle) => {
      updateElementStyle(elementId, 'borderStyle', value);
    },
    [elementId],
  );

  return (
    <RadioToggleGroup
      size="md"
      value={borderStyle}
      onValueChange={handleSelect}
    >
      {borderStyles.map((style) => (
        <Toggle key={style.value} value={style.value} label={t(style.label)}>
          {borderStyleIcons[style.value]}
        </Toggle>
      ))}
    </RadioToggleGroup>
  );
};
