import { useCallback } from 'react';
import { GradientDirection } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { RadioToggleGroup, Toggle } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface BackdropBlurGradientDirectionToggleProps {
  elementId: string;
}

const directions: {
  label: string;
  value: GradientDirection;
  icon: 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right';
}[] = [
  {
    label: 'designs.backdrop-blur-gradient-direction.to-top',
    value: 'to-top',
    icon: 'arrow-up',
  },
  {
    label: 'designs.backdrop-blur-gradient-direction.to-bottom',
    value: 'to-bottom',
    icon: 'arrow-down',
  },
  {
    label: 'designs.backdrop-blur-gradient-direction.to-left',
    value: 'to-left',
    icon: 'arrow-left',
  },
  {
    label: 'designs.backdrop-blur-gradient-direction.to-right',
    value: 'to-right',
    icon: 'arrow-right',
  },
];

export const BackdropBlurGradientDirectionToggle = ({
  elementId,
}: BackdropBlurGradientDirectionToggleProps) => {
  const { t } = useTranslation();
  const direction = useElementStyle(elementId, 'backdropBlurGradientDirection');

  // Update the gradient direction
  const handleSelect = useCallback(
    (value: GradientDirection) => {
      updateElementStyle(elementId, 'backdropBlurGradientDirection', value);
    },
    [elementId],
  );

  return (
    <RadioToggleGroup size="md" value={direction} onValueChange={handleSelect}>
      {directions.map((dir) => (
        <Toggle key={dir.value} {...dir} label={t(dir.label)} />
      ))}
    </RadioToggleGroup>
  );
};
