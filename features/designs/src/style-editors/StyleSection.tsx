import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Collapsible,
  CollapsibleContent,
  IconButton,
  Stack,
  Text,
  useTransientState,
} from '@minddrop/ui-primitives';
import './StyleSection.css';

/**
 * Signal collapsing every mounted section when it changes, fired
 * by the panel-level styling reset.
 */
export const StyleSectionResetContext = createContext(0);

export interface StyleSectionProps {
  /**
   * The i18n key of the section label.
   */
  label: TranslationKey;

  /**
   * The style keys the section governs. The section expands while
   * any of them is set, and the clear button unsets all of them.
   */
  keys: string[];

  /**
   * Reads a governed key's value.
   */
  getValue: (key: string) => unknown;

  /**
   * Writes a governed key, clearing it when the value is
   * undefined.
   */
  setValue: (key: string, value: unknown) => void;

  /**
   * A further set-value condition tracked alongside the governed
   * keys, for sections holding state outside the element style.
   */
  hasCustomValues?: boolean;

  /**
   * Whether a governed key is editable. When given, a section none
   * of whose governed keys are editable renders nothing, so a role
   * restricting its editable styles hides whole sections.
   */
  isEditable?: (key: string) => boolean;

  /**
   * Whether the section stays open, for the fields an element is
   * mostly shaped by.
   */
  permanent?: boolean;

  /**
   * Called when the user expands the section, for sections whose
   * styling needs a first value set to take effect.
   */
  onOpen?: () => void;

  /**
   * Called when the section is cleared, alongside unsetting the
   * governed keys.
   */
  onClear?: () => void;

  /**
   * The fields inside the section. A section renders nothing when
   * every one of its fields is suppressed.
   */
  children: React.ReactNode;
}

/**
 * Renders a collapsible group of style fields. Sections stay
 * closed until the user opens one, so the panel opens showing
 * only what the element actually sets rather than every option at
 * once. A section holding set values expands itself and offers a
 * clear button, which unsets those values and closes it again.
 * Permanent sections stay open throughout with no button: the
 * panel header's reset covers their values.
 */
export const StyleSection: React.FC<StyleSectionProps> = ({
  label,
  keys,
  getValue,
  setValue,
  hasCustomValues = false,
  isEditable,
  permanent = false,
  onOpen,
  onClear,
  children,
}) => {
  const resetSignal = useContext(StyleSectionResetContext);
  const lastResetSignal = useRef(resetSignal);

  // Kept in the view's transient state so sections the user opened
  // are still open when the studio remounts
  const [manuallyOpen, setManuallyOpen] = useTransientState(
    `style-section:${label}`,
    false,
  );

  // A panel-level reset collapses sections left open by hand, so
  // a cleared panel does not linger expanded
  useEffect(() => {
    // Only a new signal collapses, not the mount pass
    if (resetSignal === lastResetSignal.current) {
      return;
    }

    lastResetSignal.current = resetSignal;
    setManuallyOpen(false);
  }, [resetSignal, setManuallyOpen]);

  // Whether the element sets any of the keys this section governs
  const hasSetKeys = keys.some((key) => getValue(key) !== undefined);
  const hasSetValues = hasSetKeys || hasCustomValues;

  // A section holding set values stays open until they are
  // cleared, so a value can never hide inside a closed section
  const isOpen = permanent || hasSetValues || manuallyOpen;

  // Unset every governed key and close the section, which is what
  // collapsing a section with values in it means
  const clearSection = useCallback(() => {
    keys.forEach((key) => {
      setValue(key, undefined);
    });

    if (onClear) {
      onClear();
    }

    setManuallyOpen(false);
  }, [keys, setValue, onClear, setManuallyOpen]);

  const handleToggle = useCallback(() => {
    // Expanding enables the section's default styling, so the
    // section takes effect without a first field interaction
    if (!isOpen && onOpen) {
      onOpen();
    }

    setManuallyOpen(!isOpen);
  }, [isOpen, onOpen, setManuallyOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleToggle();
      }
    },
    [handleToggle],
  );

  // Keep the section open while the user works in it, even when an
  // edit momentarily leaves every governed key unset
  const handleContentPointerDown = useCallback(() => {
    setManuallyOpen(true);
  }, [setManuallyOpen]);

  // A section none of whose governed keys are editable leaves
  // nothing to offer, so it renders nothing at all
  if (isEditable && keys.length > 0 && !keys.some(isEditable)) {
    return null;
  }

  // A section whose fields are all suppressed leaves nothing to
  // label, so it renders nothing at all
  if (!hasVisibleChildren(children)) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      className="designs-style-section"
      data-open={isOpen}
    >
      {/** Header row: the label and the toggle or clear button **/}
      <div
        role={permanent ? undefined : 'button'}
        tabIndex={permanent ? undefined : 0}
        className="designs-style-section-trigger"
        onClick={permanent ? undefined : handleToggle}
        onKeyDown={permanent ? undefined : handleKeyDown}
      >
        <Text
          className="designs-style-section-label"
          text={label}
          size="base"
          weight="semibold"
          color={isOpen ? 'regular' : 'muted'}
        />

        {/** A permanent section neither opens nor closes, and the
         * panel header's reset covers its values, so it offers no
         * button at all **/}
        {!permanent && (
          <IconButton
            icon={resolveHeaderIcon(hasSetValues, isOpen)}
            label={
              hasSetValues ? 'designs.clear-custom-styling' : 'actions.expand'
            }
            variant="ghost"
            color="inherit"
            size="sm"
            danger={hasSetValues ? 'on-hover' : undefined}
            tooltip={
              hasSetValues
                ? {
                    title: 'designs.clear-custom-styling',
                    delay: 0,
                    side: 'left',
                  }
                : undefined
            }
            onClick={hasSetValues ? clearSection : handleToggle}
          />
        )}
      </div>

      {/** The section's fields **/}
      <CollapsibleContent>
        <Stack gap={3} onPointerDownCapture={handleContentPointerDown}>
          {children}
        </Stack>
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * Resolves the icon of the section's header button.
 */
function resolveHeaderIcon(hasSetValues: boolean, isOpen: boolean): UiIconName {
  // A section holding values offers the clear instead of a toggle
  if (hasSetValues) {
    return 'eraser';
  }

  return isOpen ? 'minus' : 'plus';
}

/**
 * Checks whether any child actually renders, treating null, false
 * and undefined entries as absent.
 */
function hasVisibleChildren(children: React.ReactNode): boolean {
  // A plain array of fields, the usual case
  if (Array.isArray(children)) {
    return children.some((child) => Boolean(child));
  }

  return Boolean(children);
}
