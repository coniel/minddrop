import React, { useMemo } from 'react';
import { MarkKey } from '@minddrop/ast';
import {
  FloatingToolbar,
  IconRenderer,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  ToolbarIconButton,
} from '@minddrop/ui-primitives';
import { MarkConfigs } from '../MarkConfigs';
import { RangeAnchor } from '../utils';
import './SelectionToolbar.css';

export interface SelectionToolbarProps {
  /**
   * The position of the selected text, or null when nothing is selected.
   */
  anchor: RangeAnchor | null;

  /**
   * The marks applied across the whole selection, shown as pressed.
   */
  activeMarks: MarkKey[];

  /**
   * Callback fired when a mark is toggled on the selection.
   */
  onToggleMark: (mark: MarkKey) => void;
}

/**
 * Renders the formatting actions for the selected text, floating above it.
 */
export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  anchor,
  activeMarks,
  onToggleMark,
}) => {
  // Positioned against the selected text rather than against a trigger
  // element, of which the toolbar has none
  const positionerAnchor = useMemo(
    () => (anchor ? { getBoundingClientRect: () => anchor.rect } : undefined),
    [anchor],
  );

  return (
    <Popover open={!!anchor} modal={false}>
      <PopoverPortal>
        <PopoverPositioner
          anchor={positionerAnchor}
          side="top"
          align="center"
          sideOffset={8}
        >
          <PopoverContent
            className="selection-toolbar-popover"
            // Focus stays in the editor so that the selection remains
            // painted and the marks apply to it
            initialFocus={false}
            finalFocus={false}
            onMouseDown={preventFocusLoss}
          >
            <FloatingToolbar size="sm" visible aria-label="formatting">
              {MarkConfigs.map((markConfig) => (
                <ToolbarIconButton
                  key={markConfig.key}
                  // Matched to the toolbar's own size, which the buttons
                  // would otherwise be taller than
                  size="sm"
                  label={markConfig.label}
                  active={activeMarks.includes(markConfig.key)}
                  tooltip={{
                    title: markConfig.label,
                    keyboardShortcut: resolveShortcut(markConfig.hotkeys),
                  }}
                  onClick={() => onToggleMark(markConfig.key)}
                >
                  <IconRenderer icon={markConfig.icon} />
                </ToolbarIconButton>
              ))}
            </FloatingToolbar>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

/**
 * Returns the keys of a mark's first hotkey, shown in its tooltip.
 *
 * @param hotkeys The mark's hotkeys.
 * @returns The keys, or undefined for a mark with no hotkey.
 */
function resolveShortcut(
  hotkeys: { keys: string[] }[] = [],
): string[] | undefined {
  const [hotkey] = hotkeys;

  if (!hotkey) {
    return undefined;
  }

  // Written with a capitalised modifier, which renders as the platform's
  // own modifier key
  return hotkey.keys.map((key) => (key === 'mod' ? 'Mod' : key));
}

/**
 * Prevents pressing the toolbar from moving focus out of the editor, which
 * would drop the selection the marks apply to.
 */
function preventFocusLoss(event: React.MouseEvent<HTMLDivElement>): void {
  event.preventDefault();
}
