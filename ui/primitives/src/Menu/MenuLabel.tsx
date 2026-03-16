import React, { forwardRef, useMemo } from 'react';
import { TranslationKey, i18n } from '@minddrop/i18n';
import { Text } from '../Text';
import { propsToClass } from '../utils';

export interface MenuLabelProps extends React.HTMLProps<HTMLDivElement> {
  /*
   * i18n key for the label text. Falls back to children if not provided.
   */
  label?: TranslationKey;

  /*
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label` and `children`.
   */
  stringLabel?: string;

  /*
   * Label content. Used when no i18n key is provided.
   */
  children?: React.ReactNode;

  /*
   * When true, the label is styled and behaves as a button.
   */
  button?: boolean;

  /*
   * Click handler. Only relevant when button is true.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /*
   * Actions displayed alongside the label.
   */
  actions?: React.ReactNode;

  /*
   * When true, actions are always visible regardless of hover state.
   * @default false
   */
  actionsAlwaysVisible?: boolean;
}

export const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  (
    {
      actions,
      actionsAlwaysVisible,
      button,
      children,
      className,
      label,
      stringLabel,
      ...other
    },
    ref,
  ) => {
    // Resolve the display label from the available label sources
    const resolvedLabel = useMemo(() => {
      if (stringLabel) {
        return stringLabel;
      }

      if (label) {
        return i18n.t(label);
      }

      return children;
    }, [stringLabel, label, children]);

    return (
      <div
        ref={ref}
        className={propsToClass('menu-label', {
          actionsAlwaysVisible,
          className,
        })}
        role={button ? 'button' : undefined}
        {...other}
      >
        <Text
          className="menu-label-text"
          color="subtle"
          weight="semibold"
          size="xs"
        >
          {resolvedLabel}
        </Text>
        {actions && <div className="actions">{actions}</div>}
      </div>
    );
  },
);

MenuLabel.displayName = 'MenuLabel';
