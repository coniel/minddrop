import React from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import { Icon } from '../Icon';
import { Tooltip, TooltipProps } from '../Tooltip';
import './FloatingActionButton.css';

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The name of the icon to render.
   */
  icon: UiIconName;

  /**
   * Accessible label announced by screen readers.
   */
  label: TranslationKey;

  /**
   * The rendered element. Defaults to 'button'.
   */
  as?: React.ElementType;

  /**
   * Tooltip configuration. When provided, wraps the button
   * in a Tooltip with the given props.
   */
  tooltip?: Omit<TooltipProps, 'children'>;
}

/**
 * Renders a round, white icon button with a raised shadow and a
 * subtle scale effect on hover and press. Uses hardcoded light-mode
 * colours so it looks the same in both light and dark themes.
 *
 * Intended for actions placed over backdrops, floating next to
 * dialogs or panels (e.g. close, expand, navigation arrows).
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> =
  React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
    ({ icon, label, as, tooltip, className, ...other }, ref) => {
      const { t } = useTranslation();
      const Component = as || 'button';

      const button = (
        <Component
          type="button"
          ref={ref}
          aria-label={t(label)}
          className={`floating-action-button${className ? ` ${className}` : ''}`}
          {...other}
        >
          <Icon name={icon} />
        </Component>
      );

      if (tooltip) {
        return (
          <Tooltip side="right" {...tooltip}>
            {button}
          </Tooltip>
        );
      }

      return button;
    },
  );

FloatingActionButton.displayName = 'FloatingActionButton';
