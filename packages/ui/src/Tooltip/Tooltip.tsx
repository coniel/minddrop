import React, { FC } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import './Tooltip.css';
import { Text } from '../Text';
import { KeyboardShortcut } from '../KeyboardShortcut';

type TooltipBaseProps = Pick<
  TooltipPrimitive.TooltipProps,
  'defaultOpen' | 'open' | 'onOpenChange'
> &
  Pick<
    TooltipPrimitive.TooltipProviderProps,
    'skipDelayDuration' | 'delayDuration'
  >;

type TooltipContentProps = Pick<
  TooltipPrimitive.TooltipContentProps,
  | 'aria-label'
  | 'portalled'
  | 'side'
  | 'sideOffset'
  | 'align'
  | 'alignOffset'
  | 'avoidCollisions'
  | 'collisionTolerance'
>;

export interface TooltipProps extends TooltipBaseProps, TooltipContentProps {
  /**
   * The content of the Tooltip.
   */
  children: React.ReactNode;

  /**
   * The primary content of the tooltip, typically the name of the action.
   */
  title: React.ReactNode;

  /**
   * Optional secondary content providing additional details.
   */
  description?: React.ReactNode;

  /**
   * An array of key name strings. Use 'Mod' to render '⌘' or 'Ctrl' on Mac
   * and Widnows/Linux respectively.
   */
  keyboardShortcut?: string[];
}

export const Tooltip: FC<TooltipProps> = ({
  children,
  defaultOpen,
  open,
  onOpenChange,
  delayDuration,
  skipDelayDuration,
  title,
  description,
  keyboardShortcut,
  ...other
}) => {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      <TooltipPrimitive.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className="tooltip"
          side="bottom"
          align="center"
          sideOffset={5}
          {...other}
        >
          <Text as="div" color="contrast" size="small" weight="medium">
            {title}
          </Text>
          {description && (
            <Text
              as="div"
              size="small"
              color="contrast-light"
              className="description"
            >
              {description}
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
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
