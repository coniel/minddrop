import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Group, KeyboardShortcut, Text } from '@minddrop/ui-primitives';
import {
  AddContentMenu,
  AddContentMenuProps,
  AddedContent,
} from '../AddContentMenu';
import './AddContentPicker.css';

export interface AddContentPickerProps
  extends Pick<
    AddContentMenuProps,
    'suggested' | 'excludeIds' | 'limit' | 'onAdd' | 'onSecondaryAdd'
  > {
  /**
   * Called when the card is dismissed without anything being added.
   */
  onDismiss: () => void;

  /**
   * Keeps the card scrolled into view within a scrollable host, on
   * mount and after secondary selections push it down. Leave off in
   * hosts which must not be scrolled.
   */
  scrollIntoView?: boolean;

  /**
   * Optional additional class name for the card element.
   */
  className?: string;
}

/**
 * Renders a placeholder card hosting the add content menu.
 */
export const AddContentPicker: React.FC<AddContentPickerProps> = ({
  onAdd,
  onSecondaryAdd,
  onDismiss,
  scrollIntoView = false,
  className,
  ...menuProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation({ keyPrefix: 'addContent.hints' });

  // Bring the card into view if it only partially fit on screen.
  // Runs a frame after the search input's scroll-free auto-focus.
  useEffect(() => {
    if (!scrollIntoView) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollCardIntoView);
    });
  }, [scrollIntoView]);

  // Dismiss the card on Escape. The search field clears a non-empty
  // query itself and stops propagation, so only an empty query
  // reaches here.
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      onDismiss();
    }
  }

  // Keep focus in the search input when pressing the card's other
  // elements, so selection clicks never blur it.
  function handleMouseDown(event: React.MouseEvent) {
    if (!(event.target instanceof HTMLInputElement)) {
      event.preventDefault();
    }
  }

  // Dismiss the card when focus leaves it. Selection clicks never
  // blur the input, so any blur out of the card is an outside
  // interaction.
  function handleBlur(event: React.FocusEvent) {
    // Ignore focus moving within the card
    if (
      event.relatedTarget &&
      containerRef.current?.contains(event.relatedTarget)
    ) {
      return;
    }

    onDismiss();
  }

  // Report added content and keep the card in view
  function handleSecondaryAdd(content: AddedContent) {
    // Hand the content to the consumer
    onSecondaryAdd?.(content);

    // Keep the card in view once the added content has pushed it
    // down. Deferred to the frame after the layout update.
    if (scrollIntoView) {
      requestAnimationFrame(scrollCardIntoView);
    }
  }

  // Scroll the card fully into view within the host
  function scrollCardIntoView() {
    containerRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  return (
    <div
      ref={containerRef}
      className={`add-content-picker${className ? ` ${className}` : ''}`}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onBlur={handleBlur}
    >
      {/** The add content menu **/}
      <AddContentMenu
        scrollable
        onAdd={onAdd}
        onSecondaryAdd={onSecondaryAdd ? handleSecondaryAdd : undefined}
        {...menuProps}
      />

      {/** Keyboard hint **/}
      <Group gap={1} className="add-content-picker-hint">
        <KeyboardShortcut keys={['Enter']} size="xs" color="subtle" />
        <Text size="xs" color="subtle">
          {t('add')}
        </Text>
        <Text size="xs" color="subtle">
          ·
        </Text>
        <KeyboardShortcut keys={['Shift', 'Enter']} size="xs" color="subtle" />
        <Text size="xs" color="subtle">
          {t('addMore')}
        </Text>
      </Group>
    </div>
  );
};
