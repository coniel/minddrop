import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import React, { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { Text } from '../Text';
import { TranslatableNode } from '../types';
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
   * Primary content — typically the name of the action or element.
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
    <TooltipPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger delay={delay} render={children} />
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
