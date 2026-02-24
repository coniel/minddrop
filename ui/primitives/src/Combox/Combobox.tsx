import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React, { FC } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Menu, MenuItem } from '../Menu';
import { MenuLabel } from '../Menu/MenuLabel';
import { MenuSeparator } from '../Menu/MenuSeparator';
import { MenuItemRendererProps } from '../MenuItemRenderer';
import './Combobox.css';

/* ============================================================
   CHECK ICON
   Default indicator for selected items.
   ============================================================ */

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentcolor"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      {...props}
    >
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

export type ComboboxProps<
  TValue extends string = string,
  TMultiple extends boolean = false,
> = ComboboxPrimitive.Root.Props<TValue, TMultiple>;

export const Combobox = ComboboxPrimitive.Root;

/* ============================================================
   INPUT
   Uses TextField's outline/md classes for styling.
   No variants or size options — always outline md.
   ============================================================ */

export interface ComboboxInputProps
  extends Omit<ComboboxPrimitive.Input.Props, 'placeholder'> {
  /*
   * Placeholder text. Can be an i18n key.
   */
  placeholder?: string;
}

export const ComboboxInput: FC<ComboboxInputProps> = ({
  placeholder,
  className,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <div className="text-field text-field-variant-outline text-field-size-md">
      <div className="text-field-input-wrapper">
        <ComboboxPrimitive.Input
          className={`text-field-input combobox-input${className ? ` ${className}` : ''}`}
          placeholder={placeholder ? t(placeholder) : undefined}
          {...other}
        />
      </div>
    </div>
  );
};

/* ============================================================
   PORTAL
   ============================================================ */

export type ComboboxPortalProps = ComboboxPrimitive.Portal.Props;

export const ComboboxPortal = ComboboxPrimitive.Portal;

/* ============================================================
   POSITIONER
   ============================================================ */

export type ComboboxPositionerProps = ComboboxPrimitive.Positioner.Props;

export const ComboboxPositioner = React.forwardRef<
  HTMLDivElement,
  ComboboxPositionerProps
>((props, ref) => (
  <ComboboxPrimitive.Positioner
    ref={ref}
    className="combobox-positioner"
    {...props}
  />
));

ComboboxPositioner.displayName = 'ComboboxPositioner';

/* ============================================================
   POPUP
   Uses the same Menu panel styling as DropdownMenu/ContextMenu.
   ============================================================ */

export interface ComboboxPopupProps extends ComboboxPrimitive.Popup.Props {
  /*
   * Minimum width of the popup panel.
   */
  minWidth?: number;
  className?: string;
}

export const ComboboxPopup = React.forwardRef<
  HTMLDivElement,
  ComboboxPopupProps
>(({ children, minWidth, className, ...other }, ref) => (
  <ComboboxPrimitive.Popup
    ref={ref}
    render={
      <Menu style={{ minWidth }} className={className}>
        {children}
      </Menu>
    }
    {...other}
  />
));

ComboboxPopup.displayName = 'ComboboxPopup';

/* ============================================================
   LIST
   Scrollable item list inside the popup.
   ============================================================ */

export type ComboboxListProps = ComboboxPrimitive.List.Props;

export const ComboboxList = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  (props, ref) => (
    <ComboboxPrimitive.List ref={ref} className="combobox-list" {...props} />
  ),
);

ComboboxList.displayName = 'ComboboxList';

/* ============================================================
   ITEM
   Uses MenuItemRenderer for consistent styling with
   DropdownMenu and ContextMenu items.
   ============================================================ */

export type ComboboxItemProps = Omit<MenuItemRendererProps, 'onClick'> & {
  /*
   * The value this item represents.
   */
  value: string;
  onClick?: ComboboxPrimitive.Item.Props['onClick'];
};

export const ComboboxItem: FC<ComboboxItemProps> = ({
  value,
  onClick,
  ...rendererProps
}) => (
  <ComboboxPrimitive.Item
    render={<MenuItem {...rendererProps} />}
    value={value}
    onClick={onClick}
  />
);

/* ============================================================
   ITEM INDICATOR
   Renders inside a ComboboxItem to show selection state.
   Uses CheckIcon by default; accepts children for custom indicators.
   ============================================================ */

export interface ComboboxItemIndicatorProps
  extends ComboboxPrimitive.ItemIndicator.Props {
  children?: React.ReactNode;
}

export const ComboboxItemIndicator: FC<ComboboxItemIndicatorProps> = ({
  children,
  ...other
}) => (
  <ComboboxPrimitive.ItemIndicator
    className="combobox-item-indicator"
    {...other}
  >
    {children ?? <CheckIcon />}
  </ComboboxPrimitive.ItemIndicator>
);

/* ============================================================
   SEPARATOR
   ============================================================ */

export type ComboboxSeparatorProps = ComboboxPrimitive.Separator.Props;

export const ComboboxSeparator: FC<ComboboxSeparatorProps> = (props) => (
  <ComboboxPrimitive.Separator render={<MenuSeparator />} {...props} />
);

/* ============================================================
   LABEL
   ============================================================ */

export interface ComboboxLabelProps
  extends Omit<ComboboxPrimitive.GroupLabel.Props, 'children'> {
  children?: React.ReactNode;
  /*
   * Label string. Can be an i18n key. Translated internally.
   */
  label?: string;
}

export const ComboboxLabel: FC<ComboboxLabelProps> = ({
  children,
  label,
  ...other
}) => {
  const { t } = useTranslation();
  return (
    <ComboboxPrimitive.GroupLabel {...other}>
      <MenuLabel>{label ? t(label) : children}</MenuLabel>
    </ComboboxPrimitive.GroupLabel>
  );
};

/* ============================================================
   GROUP
   ============================================================ */

export interface ComboboxGroupProps extends ComboboxPrimitive.Group.Props {
  /*
   * Group label. Can be an i18n key. Translated internally.
   */
  label?: string;
}

export const ComboboxGroup: FC<ComboboxGroupProps> = ({
  label,
  children,
  ...other
}) => (
  <ComboboxPrimitive.Group {...other}>
    {label && <ComboboxLabel label={label} />}
    {children}
  </ComboboxPrimitive.Group>
);

/* ============================================================
   EMPTY STATE
   Rendered when no items match the current input value.
   ============================================================ */

export interface ComboboxEmptyProps {
  /*
   * Message shown when there are no matching items.
   * Can be an i18n key.
   * @default 'No results'
   */
  message?: string;
}

export const ComboboxEmpty: FC<ComboboxEmptyProps> = ({
  message = 'No results',
}) => {
  const { t } = useTranslation();
  return <div className="combobox-empty">{t(message)}</div>;
};
