import React from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  MenuGroup,
  MenuItem,
  isKeyboardInputMode,
} from '@minddrop/ui-primitives';
import { CursorMenu } from '../CursorMenu';
import { EditorReference } from '../types';
import { RangeAnchor } from '../utils';
import './ReferenceMenu.css';

export interface ReferenceMenuProps {
  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Callback fired when the menu is dismissed.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The position and styling of the trigger text.
   */
  anchor: RangeAnchor | null;

  /**
   * Whether to render the hint prompting for a query.
   */
  showHint: boolean;

  /**
   * The references matching the query typed after the trigger.
   */
  references: EditorReference[];

  /**
   * The index of the highlighted reference.
   */
  activeIndex: number;

  /**
   * Callback fired when a reference is highlighted using the mouse.
   */
  onHighlight: (index: number) => void;

  /**
   * Callback fired when a reference is selected.
   */
  onSelect: (index: number) => void;
}

/**
 * Renders the references which can be linked to, positioned against the
 * cursor. Keyboard interaction is driven from the editor, which keeps focus.
 */
export const ReferenceMenu: React.FC<ReferenceMenuProps> = ({
  open,
  onOpenChange,
  anchor,
  showHint,
  references,
  activeIndex,
  onHighlight,
  onSelect,
}) => {
  const { t } = useTranslation();

  // Moves the highlight to the reference under the pointer
  function handleItemMouseMove(index: number): void {
    // Mouse events fired while the keyboard owns the navigation come from
    // the list scrolling or filtering under a stationary pointer, and must
    // not take the highlight off the entry the keyboard navigated to.
    if (isKeyboardInputMode()) {
      return;
    }

    onHighlight(index);
  }

  return (
    <CursorMenu
      open={open}
      onOpenChange={onOpenChange}
      anchor={anchor}
      activeIndex={activeIndex}
      className="reference-menu"
      hint={showHint ? t('editor.linkMenu.hint') : undefined}
    >
      <MenuGroup>
        {references.map((reference, index) => (
          <MenuItem
            key={reference.reference}
            stringLabel={reference.label}
            stringDescription={reference.description}
            icon={reference.icon}
            active={index === activeIndex}
            data-cursor-menu-active={index === activeIndex || undefined}
            onMouseMove={() => handleItemMouseMove(index)}
            onClick={() => onSelect(index)}
          />
        ))}
      </MenuGroup>
    </CursorMenu>
  );
};
