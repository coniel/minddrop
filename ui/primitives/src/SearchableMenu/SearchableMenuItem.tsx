import React, { FC, useEffect, useId, useRef } from 'react';
import { ActionMenuItemProps } from '../ActionMenuItem';
import { MenuItem } from '../Menu/MenuItem';
import { useMenuSearchContext } from '../Menu/MenuSearchContext';

/* ============================================================
   TYPES
   ============================================================ */

export type SearchableMenuItemProps = Omit<ActionMenuItemProps, 'textValue'> &
  (
    | {
        /**
         * Content rendered as the item label. Requires textValue
         * so the searchable menu can match the item.
         */
        children: React.ReactElement;

        /**
         * Plain text value used for search matching.
         * Required when children is provided.
         */
        textValue: string;
      }
    | {
        children?: never;

        /**
         * Plain text value used for search matching.
         * Optional when label or stringLabel is provided.
         */
        textValue?: string;
      }
  );

/* ============================================================
   SEARCHABLE MENU ITEM
   Renders a MenuItem that registers with the parent
   SearchableMenu for search filtering. Navigation (highlighting,
   mouse interaction) is handled via context rather than Base UI's
   composite navigation, so focus stays on the search input.
   ============================================================ */

export const SearchableMenuItem: FC<SearchableMenuItemProps> = (props) => {
  const {
    label,
    stringLabel,
    description,
    stringDescription,
    icon,
    contentIcon,
    disabled,
    children,
  } = props;
  const id = useId();
  const searchContext = useMenuSearchContext();
  const propsRef = useRef<ActionMenuItemProps>(props);

  // Keep the ref up to date on every render
  propsRef.current = props;

  const { register, unregister } = searchContext;

  // Register with the search context. Depends only on the stable
  // registration functions, as depending on the context value would
  // re-register the item every time the highlight or registry
  // changes, which never settles.
  useEffect(() => {
    register(id, { propsRef });

    return () => {
      unregister(id);
    };
  }, [id, register, unregister]);

  // Get navigation props from the searchable menu
  const navProps = searchContext.getItemNavProps(id);

  return (
    <MenuItem
      ref={navProps?.ref}
      onMouseMove={navProps?.onMouseMove}
      onMouseLeave={navProps?.onMouseLeave}
      onClick={navProps?.onClick}
      label={label}
      stringLabel={stringLabel}
      description={description}
      stringDescription={stringDescription}
      icon={icon}
      contentIcon={contentIcon}
      disabled={disabled}
      active={navProps?.highlighted}
    >
      {children}
    </MenuItem>
  );
};
