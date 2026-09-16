import { DesignElementContentControlsProps } from '@minddrop/designs-next';
import { IconPicker, ToolbarIconButton } from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';

/**
 * Renders the content control of elements drawing a static icon: a
 * toolbar button opening an icon picker in a popover.
 */
export const IconContentControls: React.FC<
  DesignElementContentControlsProps
> = ({ element, onContentChange }) => (
  <IconPicker
    closeOnSelect
    side="right"
    align="start"
    sideOffset={BlockControlOffset}
    currentIcon={element.content}
    onSelect={onContentChange}
    onClear={() => onContentChange(undefined)}
  >
    <ToolbarIconButton
      variant="subtle"
      icon="smile"
      label="designsNext.content.iconLabel"
      highlighted={Boolean(element.content)}
      tooltip={{
        side: 'right',
        sideOffset: BlockControlOffset,
        title: 'designsNext.content.iconLabel',
        description: 'designsNext.content.description',
      }}
    />
  </IconPicker>
);
