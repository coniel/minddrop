import React, { FC } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import './Tooltip.css';
import { Text } from '../Text';
import { KeyboardShortcut } from '../KeyboardShortcut';
import { useTranslation } from '@minddrop/i18n';

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
  | 'side'
  | 'sideOffset'
  | 'align'
  | 'alignOffset'
  | 'avoidCollisions'
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
  delayDuration,
  skipDelayDuration,
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
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={['tooltip', className].filter(Boolean).join(' ')}
            side="bottom"
            align="center"
            sideOffset={5}
            {...other}
          >
            <Text as="div" color="contrast" size="small" weight="medium">
              {translatedTitle}
            </Text>
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
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
