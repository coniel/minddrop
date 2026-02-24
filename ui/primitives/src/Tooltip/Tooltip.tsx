import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import React, { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { Text } from '../Text';
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
   * Can be an i18n key.
   */
  title?: React.ReactNode;

  /*
   * Optional secondary content providing additional context.
   * Can be an i18n key.
   */
  description?: React.ReactNode;

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
  description,
  keyboardShortcut,
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'center',
  alignOffset,
  ...other
}) => {
  const { t } = useTranslation();

  const translatedTitle = typeof title === 'string' ? t(title) : title;
  const translatedDescription =
    typeof description === 'string' ? t(description) : description;

  return (
    <TooltipPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger delay={delay} render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <TooltipPrimitive.Popup
            className={['tooltip', className].filter(Boolean).join(' ')}
            {...other}
          >
            {title && (
              <Text as="div" size="sm" weight="medium">
                {translatedTitle}
              </Text>
            )}
            {description && (
              <Text as="div" size="sm" className="tooltip-description">
                {translatedDescription}
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
