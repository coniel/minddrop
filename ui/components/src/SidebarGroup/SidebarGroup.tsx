import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  MenuGroup,
  MenuGroupProps,
  MenuLabel,
  Text,
} from '@minddrop/ui-primitives';
import './SidebarGroup.css';

export interface SidebarGroupProps extends Pick<MenuGroupProps, 'marginTop'> {
  /**
   * i18n key for the group's label.
   */
  label?: TranslationKey;

  /**
   * Plain string label rendered as-is without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * Actions displayed alongside the label, revealed when the
   * group is hovered.
   */
  actions?: React.ReactNode;

  /**
   * Whether the group is initially expanded.
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * Whether hovering anywhere in the group reveals the label
   * actions. When `false`, only hovering the label reveals them.
   * @default true
   */
  showLabelActionsOnHover?: boolean;

  /**
   * The group's menu items.
   */
  children?: React.ReactNode;

  /**
   * Empty state shown in place of the items when the group has
   * none.
   */
  emptyLabel?: TranslationKey;
}

/**
 * Renders a collapsible labelled group of menu items in the app sidebar.
 */
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  stringLabel,
  actions,
  defaultOpen = true,
  showLabelActionsOnHover = true,
  marginTop,
  children,
  emptyLabel,
}) => (
  <MenuGroup
    marginTop={marginTop}
    showLabelActionsOnHover={showLabelActionsOnHover}
  >
    <Collapsible className="sidebar-group" defaultOpen={defaultOpen}>
      {/* Label acting as the expand/collapse trigger */}
      <CollapsibleTrigger
        nativeButton={false}
        render={
          <MenuLabel
            button
            label={label}
            stringLabel={stringLabel}
            actions={actions}
          />
        }
      />
      <CollapsibleContent>
        <MenuGroup>
          {React.Children.count(children) > 0
            ? children
            : emptyLabel && (
                /* Empty state shown when the group has no items */
                <Text
                  block
                  size="sm"
                  color="muted"
                  className="sidebar-group-empty"
                  text={emptyLabel}
                />
              )}
        </MenuGroup>
      </CollapsibleContent>
    </Collapsible>
  </MenuGroup>
);
