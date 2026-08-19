import { useCallback } from 'react';
import { IconElement } from '@minddrop/designs';
import { useDesignStudio, useElementData } from '../../DesignStudioStore';
import { FlatIconElement } from '../../types';
import { IconPickerField } from '../IconPickerField';

export interface IconContentFieldProps {
  /**
   * The ID of the element to edit.
   */
  elementId: string;
}

/**
 * Renders an icon picker for editing a static icon element's
 * icon.
 */
export const IconContentField: React.FC<IconContentFieldProps> = ({
  elementId,
}) => {
  const studio = useDesignStudio();
  const { icon } = useElementData(elementId, (element: FlatIconElement) => ({
    icon: element.icon || '',
  }));

  const handleSelect = useCallback(
    (newIcon: string) => {
      studio.updateDesignElement<IconElement>(elementId, { icon: newIcon });
    },
    [studio, elementId],
  );

  const handleClear = useCallback(() => {
    studio.updateDesignElement<IconElement>(elementId, { icon: '' });
  }, [studio, elementId]);

  return (
    <IconPickerField
      value={icon}
      onSelect={handleSelect}
      onClear={handleClear}
    />
  );
};
