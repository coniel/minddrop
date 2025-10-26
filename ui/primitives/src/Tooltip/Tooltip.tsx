import { Tooltip as TooltipPrimitive } from '@base-ui-components/react/tooltip';
import React, { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { Text } from '../Text';
import './Tooltip.css';

type TooltipBaseProps = Pick<
  TooltipPrimitive.Root.Props,
  'defaultOpen' | 'open' | 'onOpenChange'
> &
  Pick<TooltipPrimitive.Provider.Props, 'timeout' | 'delay'>;

type TooltipContentProps = Pick<
  TooltipPrimitive.Positioner.Props,
  'aria-label' | 'side' | 'sideOffset' | 'align' | 'alignOffset'
>;

export interface TooltipProps extends TooltipBaseProps, TooltipContentProps {
  /**
   * The content of the Tooltip.
   */
  children: React.ReactNode;

  /**
   * The primary content of the tooltip, typically the name of the action.
   */
  title?: React.ReactNode;

  /**
   * Optional secondary content providing additional details.
   */
  description?: React.ReactNode;

  /**
   * An array of key name strings. Use 'Mod' to render '⌘' or 'Ctrl' on Mac
   * and Widnows/Linux respectively.
   */
  keyboardShortcut?: string[];

  /**
   * Class name applied to the tooltiop content
   * container.
   */
  className?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  defaultOpen,
  open,
  onOpenChange,
  delay,
  timeout,
  title,
  description,
  keyboardShortcut,
  className,
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
      <TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner>
          <TooltipPrimitive.Popup
            className={['tooltip', className].filter(Boolean).join(' ')}
            side="bottom"
            align="center"
            sideOffset={5}
            {...other}
          >
            {title && (
              <Text as="div" color="contrast" size="small" weight="medium">
                {translatedTitle}
              </Text>
            )}
            {title && description && <div className="spacer" />}
            {description && (
              <Text
                as="div"
                size="small"
                color="contrast-light"
                className="description"
              >
                {translatedDescription}
              </Text>
            )}
            {keyboardShortcut && (
              <KeyboardShortcut
                as="div"
                size="small"
                color="contrast-light"
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
