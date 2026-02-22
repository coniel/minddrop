import { forwardRef } from 'react';
import { i18n } from '@minddrop/i18n';
import { Text } from '../../Text';
import { mapPropsToClasses } from '../../utils';
import './MenuLabel.css';

export interface MenuLabelProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The i18n key for the label text. If not provided, children will be used.
   */
  label?: string;

  /**
   * The content of the label. Used if no label i18n key is provided.
   */
  children?: React.ReactNode;

  /**
   * When true, the label is styled as a button.
   */
  button?: boolean;

  /**
   * onClick handler for the label when styled as a button.
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * Actions to be displayed alongside the label.
   */
  actions?: React.ReactNode;

  /**
   * When true, the actions are always visible. By default, actions
   * may be hidden until the label is hovered.
   * @default false
   */
  actionsAlwaysVisible?: boolean;
}

export const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  (
    {
      actions,
      actionsAlwaysVisible,
      children,
      className,
      label,
      button,
      ...other
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={mapPropsToClasses(
          { className, actionsAlwaysVisible },
          'menu-label',
        )}
        role={button ? 'button' : undefined}
        {...other}
      >
        <Text className="label" color="light" weight="semibold" size="tiny">
          {label ? i18n.t(label) : children}
        </Text>
        {actions && <div className="actions">{actions}</div>}
      </div>
    );
  },
);

MenuLabel.displayName = 'MenuLabel';
