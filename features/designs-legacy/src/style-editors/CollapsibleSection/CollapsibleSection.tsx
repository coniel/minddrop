import { useCallback, useMemo, useState } from 'react';
import { DesignElementStyle } from '@minddrop/designs-legacy';
import { TranslationKey } from '@minddrop/i18n';
import {
  Collapsible,
  CollapsibleContent,
  IconButton,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { updateElementStyle, useElement } from '../../DesignStudioStore';
import './CollapsibleSection.css';

export interface CollapsibleSectionProps {
  /**
   * The ID of the element being edited.
   */
  elementId: string;

  /**
   * The i18n key for the section label.
   */
  label: TranslationKey;

  /**
   * Style keys and their default values. The section auto-expands
   * when any tracked key differs from the element's current value.
   */
  defaultStyles: Partial<Record<keyof DesignElementStyle, unknown>>;

  /**
   * Additional custom-value condition tracked alongside the style
   * keys. When true, the section auto-expands and the clear
   * button is enabled.
   */
  hasCustomValues?: boolean;

  /**
   * Called when the user presses the clear button, alongside
   * resetting the tracked styles to their defaults.
   */
  onClear?: () => void;

  /**
   * Called when the section is manually opened by the user.
   */
  onOpen?: () => void;

  /**
   * The section controls.
   */
  children: React.ReactNode;
}

/**
 * Renders a collapsible section wrapper for advanced style editor
 * controls. Auto-expands when any tracked style value differs from
 * its default. Once manually opened, stays open for the session
 * (selecting a different element remounts and resets).
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  elementId,
  label,
  defaultStyles,
  hasCustomValues = false,
  onClear,
  onOpen,
  children,
}) => {
  const element = useElement(elementId);
  const [manuallyOpen, setManuallyOpen] = useState(false);

  // Check whether any tracked style key differs from its default
  const hasNonDefaultStyles = useMemo(() => {
    const style = element.style as unknown as Record<string, unknown>;

    return Object.entries(defaultStyles).some(
      ([key, defaultValue]) => style[key] !== defaultValue,
    );
  }, [element.style, defaultStyles]);

  const hasNonDefault = hasNonDefaultStyles || hasCustomValues;

  // Reset all tracked styles to their defaults and clear any
  // additional custom values
  const clearCustomStyles = useCallback(() => {
    Object.entries(defaultStyles).forEach(([key, value]) => {
      updateElementStyle(
        elementId,
        key as keyof DesignElementStyle,
        value as DesignElementStyle[keyof DesignElementStyle],
      );
    });

    if (onClear) {
      onClear();
    }

    setManuallyOpen(false);
  }, [elementId, defaultStyles, onClear]);

  const isOpen = hasNonDefault || manuallyOpen;

  // Toggles the section open/closed, calling onOpen when opening
  const handleToggle = useCallback(() => {
    if (!isOpen && onOpen) {
      onOpen();
    }

    setManuallyOpen(!isOpen);
  }, [isOpen, onOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleToggle();
      }
    },
    [handleToggle],
  );

  // Keep the section open while the user interacts with its
  // controls, even when the interaction resets every tracked
  // value back to its default
  const handleContentPointerDown = useCallback(() => {
    setManuallyOpen(true);
  }, []);

  return (
    <Collapsible
      open={isOpen}
      className="collapsible-section"
      data-open={isOpen}
    >
      {/* Header row: label and toggle icon */}
      <div
        role="button"
        tabIndex={0}
        className="collapsible-section-trigger"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <Text
          className="element-style-editor-section-label"
          text={label}
          size="base"
          weight="semibold"
          color={isOpen ? 'regular' : 'muted'}
        />
        <IconButton
          icon={isOpen ? 'minus' : 'plus'}
          label={
            hasNonDefault ? 'designs.clear-custom-styling' : 'actions.expand'
          }
          variant="ghost"
          color="inherit"
          size="sm"
          danger={hasNonDefault ? 'on-hover' : undefined}
          tooltip={
            hasNonDefault
              ? {
                  title: 'designs.clear-custom-styling',
                  delay: 0,
                  side: 'left',
                }
              : undefined
          }
          onClick={hasNonDefault ? clearCustomStyles : handleToggle}
        />
      </div>

      {/* Collapsible controls */}
      <CollapsibleContent>
        <Stack gap={3} onPointerDownCapture={handleContentPointerDown}>
          {children}
        </Stack>
      </CollapsibleContent>
    </Collapsible>
  );
};
