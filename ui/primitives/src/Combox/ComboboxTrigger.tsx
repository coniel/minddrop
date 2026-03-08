import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { FC, useCallback, useEffect, useRef } from 'react';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';

/* --- ComboboxTrigger ---
   Styled trigger button that displays selected chips and a
   chevron. Looks like a text-input field.

   Measures its own width via ResizeObserver and sets a
   --combobox-chip-max-width CSS variable so chips can
   truncate with ellipsis when they would overflow. */

export type ComboboxTriggerVariant = 'subtle' | 'outline' | 'filled';
export type ComboboxTriggerSize = 'md' | 'lg';

export interface ComboboxTriggerProps extends ComboboxPrimitive.Trigger.Props {
  /**
   * Visual style of the trigger.
   * @default 'outline'
   */
  variant?: ComboboxTriggerVariant;

  /**
   * Min-height of the trigger.
   * @default 'lg'
   */
  size?: ComboboxTriggerSize;

  /**
   * Marks the trigger as invalid (applies error styling).
   */
  invalid?: boolean;

  /**
   * Class name applied to the trigger element.
   */
  className?: string;
}

/** Trigger button styled like a text-input, showing chips and a chevron. */
export const ComboboxTrigger: FC<ComboboxTriggerProps> = ({
  variant = 'outline',
  size = 'lg',
  invalid,
  className,
  children,
  ...other
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  /* Update the chip max-width CSS variable when the trigger resizes */
  const updateChipMaxWidth = useCallback((element: HTMLButtonElement) => {
    const contentElement = element.querySelector('.combobox-trigger-content');

    if (!contentElement) {
      return;
    }

    /* Use the content area width so we exclude the chevron and
       outer padding from the calculation */
    const contentWidth = contentElement.clientWidth;

    element.style.setProperty('--combobox-chip-max-width', `${contentWidth}px`);
  }, []);

  /* Observe trigger size changes */
  useEffect(() => {
    const element = triggerRef.current;

    if (!element) {
      return;
    }

    /* Set initial value */
    updateChipMaxWidth(element);

    const observer = new ResizeObserver(() => {
      updateChipMaxWidth(element);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [updateChipMaxWidth]);

  return (
    <ComboboxPrimitive.Trigger
      ref={triggerRef}
      className={propsToClass('combobox-trigger', {
        variant,
        size,
        invalid,
        className,
      })}
      {...other}
    >
      <div className="combobox-trigger-content">{children}</div>
      <ComboboxPrimitive.Icon
        render={<Icon name="chevron-down" className="combobox-trigger-icon" />}
      />
    </ComboboxPrimitive.Trigger>
  );
};
