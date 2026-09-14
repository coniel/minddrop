import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { FC, isValidElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { Text } from '../Text';
import { TranslatableNode } from '../types';
import { lastInputMovedFocus } from './lastInputModality';
import './Tooltip.css';

type TooltipBaseProps = Pick<
  TooltipPrimitive.Root.Props,
  'defaultOpen' | 'open' | 'onOpenChange'
> &
  Pick<TooltipPrimitive.Provider.Props, 'delay'>;

type TooltipContentProps = Pick<
  TooltipPrimitive.Positioner.Props,
  'aria-label' | 'side' | 'sideOffset' | 'align' | 'alignOffset'
>;

export interface TooltipProps extends TooltipBaseProps, TooltipContentProps {
  /*
   * The element that triggers the tooltip.
   */
  children: TooltipPrimitive.Trigger.Props['render'];

  /*
   * Primary content - typically the name of the action or element.
   * Translated via i18n when a string is provided.
   */
  title?: TranslatableNode;

  /*
   * Primary content as a plain string, used as-is without
   * translation. Takes priority over `title`.
   */
  stringTitle?: string;

  /*
   * Optional secondary content providing additional context.
   * Translated via i18n when a string is provided.
   */
  description?: TranslatableNode;

  /*
   * Secondary content as a plain string, used as-is without
   * translation. Takes priority over `description`.
   */
  stringDescription?: string;

  /*
   * Keyboard shortcut displayed below the title/description.
   * Use 'Mod' to render '⌘' on Mac and 'Ctrl' on Windows/Linux.
   */
  keyboardShortcut?: string[];

  /*
   * Class name applied to the tooltip popup element.
   */
  className?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  defaultOpen,
  open,
  onOpenChange,
  delay,
  title,
  stringTitle,
  description,
  stringDescription,
  keyboardShortcut,
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'center',
  alignOffset,
  ...other
}) => {
  const { t } = useTranslation();
  // A native drag suspends pointer events, so an open tooltip never
  // hears the pointer leave and hangs over the page until the drop.
  // A menu or popover opened from the trigger does the same, and
  // reveals the tooltip again when it closes. Scrolling moves the
  // trigger out from under the tooltip without a pointer leave
  // either. Tracking open state here allows all three to dismiss
  // it.
  const [openState, setOpenState] = useState(defaultOpen ?? false);

  const isOpen = open ?? openState;

  const handleOpenChange: NonNullable<
    TooltipPrimitive.Root.Props['onOpenChange']
  > = useCallback(
    (nextOpen, eventDetails) => {
      // A popup closing hands focus back to the trigger which opened
      // it, and a focused trigger opens its tooltip. Following the
      // user's last input tells that focus from one they moved
      // themselves: a tab onto the trigger still shows the tooltip,
      // while a return to it after a press, or after the Enter which
      // committed a popup's field, does not.
      if (
        nextOpen &&
        eventDetails.reason === 'trigger-focus' &&
        !lastInputMovedFocus()
      ) {
        return;
      }

      setOpenState(nextOpen);
      onOpenChange?.(nextOpen, eventDetails);
    },
    [onOpenChange],
  );

  // Only the open tooltip watches for a drag or scroll, so these are
  // single listeners however many tooltips are mounted. Scroll events
  // do not bubble, so the capture phase catches them from any scroll
  // container.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDismiss(): void {
      setOpenState(false);
    }

    document.addEventListener('dragstart', handleDismiss, true);
    document.addEventListener('scroll', handleDismiss, true);
    document.addEventListener('pointerdown', handleDismiss, true);

    return () => {
      document.removeEventListener('dragstart', handleDismiss, true);
      document.removeEventListener('scroll', handleDismiss, true);
      document.removeEventListener('pointerdown', handleDismiss, true);
    };
  }, [isOpen]);

  // A child that already carries an id (e.g. from a wrapping menu
  // trigger) keeps it on the DOM element. The trigger must adopt the
  // same id, otherwise it cannot tell that it opened the tooltip and
  // the provider's instant-open grouping never kicks in.
  const triggerId = isValidElement<{ id?: string }>(children)
    ? children.props.id
    : undefined;

  // Translated props take precedence over string versions
  const resolvedTitle = title
    ? typeof title === 'string'
      ? t(title)
      : title
    : stringTitle;
  const resolvedDescription = description
    ? typeof description === 'string'
      ? t(description)
      : description
    : stringDescription;

  return (
    <TooltipPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <TooltipPrimitive.Trigger
        id={triggerId}
        delay={delay}
        render={children}
      />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          className="tooltip-positioner"
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <TooltipPrimitive.Popup
            className={['tooltip', className].filter(Boolean).join(' ')}
            {...other}
          >
            {resolvedTitle && (
              <Text as="div" size="sm" weight="medium">
                {resolvedTitle}
              </Text>
            )}
            {resolvedDescription && (
              <Text as="div" size="sm" className="tooltip-description">
                {resolvedDescription}
              </Text>
            )}
            {keyboardShortcut && (
              <KeyboardShortcut
                as="div"
                size="xs"
                weight="medium"
                keys={keyboardShortcut}
              />
            )}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipRoot = TooltipPrimitive.Root;
