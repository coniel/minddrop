import { useCallback } from 'react';
import { Toggle } from '@minddrop/ui-primitives';
import {
  updateElementStyle,
  useElementStyle,
} from '../../../DesignStudioStore';

export interface ItalicToggleProps {
  elementId: string;
}

export const ItalicToggle = ({ elementId }: ItalicToggleProps) => {
  const italic = useElementStyle(elementId, 'italic');

  const handleToggle = useCallback(
    (checked: boolean) => updateElementStyle(elementId, 'italic', checked),
    [elementId],
  );

  return (
    <Toggle
      label="designs.typography.italic"
      icon="italic"
      pressed={italic}
      onPressedChange={handleToggle}
    />
  );
};
