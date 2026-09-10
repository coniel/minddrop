import { DesignElementContentControlsProps } from '@minddrop/designs-next';
import {
  Button,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverTrigger,
  TextInput,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { BlockControlOffset } from '../constants';
import './TextContentControls.css';

// Lines of text the input opens at
const InputRows = 4;

/**
 * Renders the content control of elements holding static text: a
 * toolbar button opening the text in a popover, edited as it is
 * typed. Element configs whose element holds plain text take it as
 * their content controls.
 *
 * Modal so the click which dismisses the popover is caught by it,
 * rather than landing on the canvas and clearing the selection the
 * text belongs to.
 */
export const TextContentControls: React.FC<
  DesignElementContentControlsProps
> = ({ element, onContentChange }) => (
  <Popover modal>
    <PopoverTrigger>
      <ToolbarIconButton
        variant="subtle"
        icon="pencil"
        label="designsNext.content.label"
        tooltip={{
          side: 'right',
          sideOffset: BlockControlOffset,
          title: 'designsNext.content.label',
          description: 'designsNext.content.description',
        }}
      />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverPositioner
        side="right"
        align="start"
        sideOffset={BlockControlOffset}
      >
        <PopoverContent className="design-text-content-controls">
          <TextInput
            multiline
            autoGrow
            autoFocus
            variant="subtle"
            size="md"
            rows={InputRows}
            value={element.content ?? ''}
            placeholder="designsNext.content.textPlaceholder"
            onValueChange={onContentChange}
          />
          <div className="design-text-content-controls-actions">
            {element.content && (
              <PopoverClose
                onClick={() => onContentChange(undefined)}
                render={<Button size="sm" label="actions.clear" />}
              />
            )}
            <PopoverClose
              render={<Button size="sm" color="primary" label="actions.done" />}
            />
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverPortal>
  </Popover>
);
