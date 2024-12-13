import React, { FC, useEffect, useMemo, useState } from 'react';
import { Tooltip } from '../Tooltip';
import { MenuItem, MenuItemProps } from '../Menu';
import { useTranslation } from '@minddrop/i18n';

export interface MenuItemComponentProps {
  /**
   * Typically a MenuItem.
   */
  children?: React.ReactNode;

  /**
   * Change the component to the HTML tag or custom component
   * of the only child. This will merge the original component
   * props with the props of the supplied element/component and
   * change the underlying DOM node.
   */
  asChild?: boolean;

  /**
   * When `true`, prevents the user from interacting with the item.
   */
  disabled?: boolean;

  /**
   * Event handler called when the user selects an item
   * (via mouse of keyboard). Calling `event.preventDefault`
   * in this handler will prevent the context menu from
   * closing when selecting that item.
   */
  onSelect?: (event: Event) => void;
}

export interface RadioMenuItemComponentProps extends MenuItemComponentProps {
  value: string;
}

export interface InteractiveMenuItemProps
  extends MenuItemProps,
    Pick<MenuItemComponentProps, 'disabled' | 'onSelect'> {
  /**
   * The menu item primitive component.
   */
  MenuItemComponent: React.ComponentType<MenuItemComponentProps>;

  /**
   * The item label in its secondary state.
   */
  secondaryLabel?: MenuItemProps['label'];

  /**
   * Icon for the item in its secondary state.
   */
  secondaryIcon?: MenuItemProps['icon'];

  /**
   * Event handler called when the user selects an item
   * (via mouse of keyboard) in its secondary state.
   * Calling `event.preventDefault` in this handler will
   * prevent the context menu from closing when selecting
   * that item.
   */
  secondaryOnSelect?: (event: Event) => void;

  /**
   * The keyboard shortcut used to trigger the action.
   */
  keyboardShortcut?: string[];

  /**
   * The keyboard shortcut used to trigger the secondary action.
   */
  secondaryKeyboardShortcut?: string[];

  /**
   * If set, a tooltip will be added to the menu item
   * using this property as its title.
   */
  tooltipTitle?: React.ReactNode;

  /**
   * If set, a tooltip will be added to the menu item
   * using this property as its description.
   */
  tooltipDescription?: React.ReactNode;

  /**
   * Optional text used for typeahead purposes.
   * By default the typeahead behavior will use the
   * `textContent` of the item. Use this when the
   * content is complex, or you have non-textual
   * content inside.
   */
  textValue?: string;
}

export interface InteractiveRadioMenuItemProps
  extends RadioMenuItemComponentProps,
    Omit<InteractiveMenuItemProps, 'MenuItemComponent'> {
  /**
   * The menu item primitive component.
   */
  MenuItemComponent: React.ComponentType<RadioMenuItemComponentProps>;
}

export const InteractiveMenuItem: FC<
  InteractiveMenuItemProps | InteractiveRadioMenuItemProps
> = ({
  MenuItemComponent,
  label,
  secondaryLabel,
  icon,
  secondaryIcon,
  onSelect,
  secondaryOnSelect,
  keyboardShortcut,
  secondaryKeyboardShortcut,
  tooltipTitle,
  tooltipDescription,
  disabled,
  ...other
}) => {
  const { t } = useTranslation();
  const translatedLabel = useMemo(
    () => (typeof label === 'string' ? t(label) : label),
    [label, t],
  );
  const translatedSecondaryLabel = useMemo(
    () =>
      typeof secondaryLabel === 'string' ? t(secondaryLabel) : secondaryLabel,
    [secondaryLabel, t],
  );
  const [shiftKeyDown, setShiftKeyDown] = useState(false);
  const menuItemProps = shiftKeyDown
    ? {
        label: translatedSecondaryLabel || translatedLabel,
        icon: secondaryIcon || icon,
        keyboardShortcut: secondaryKeyboardShortcut,
      }
    : { label: translatedLabel, icon, keyboardShortcut };

  useEffect(() => {
    let hasEventListeners = false;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShiftKeyDown(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShiftKeyDown(false);
      }
    };

    if (secondaryOnSelect) {
      hasEventListeners = true;
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
    }

    return () => {
      if (hasEventListeners) {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      }
    };
  }, [secondaryOnSelect]);

  const Component = MenuItemComponent as FC<MenuItemComponentProps>;

  const item = (
    <Component
      asChild
      disabled={disabled}
      onSelect={
        shiftKeyDown && secondaryOnSelect ? secondaryOnSelect : onSelect
      }
      {...other}
    >
      <MenuItem disabled={disabled} {...menuItemProps} />
    </Component>
  );

  if (tooltipTitle) {
    return (
      <Tooltip
        side="right"
        sideOffset={6}
        skipDelayDuration={0}
        delayDuration={800}
        title={tooltipTitle}
        description={tooltipDescription}
      >
        {item}
      </Tooltip>
    );
  }

  return item;
};
