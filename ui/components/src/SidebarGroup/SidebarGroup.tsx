import { TranslationKey } from '@minddrop/i18n';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  MenuGroup,
  MenuGroupProps,
  MenuLabel,
} from '@minddrop/ui-primitives';
import './SidebarGroup.css';

export interface SidebarGroupProps extends Pick<MenuGroupProps, 'marginTop'> {
  /**
   * i18n key for the group's label.
   */
  label: TranslationKey;

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
   * The group's menu items.
   */
  children?: React.ReactNode;
}

/**
 * Renders a collapsible labelled group of menu items in the app sidebar.
 */
export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  actions,
  defaultOpen = true,
  marginTop,
  children,
}) => (
  <MenuGroup marginTop={marginTop} showLabelActionsOnHover>
    <Collapsible className="sidebar-group" defaultOpen={defaultOpen}>
      {/* Label acting as the expand/collapse trigger */}
      <CollapsibleTrigger
        nativeButton={false}
        render={<MenuLabel button label={label} actions={actions} />}
      />
      <CollapsibleContent>
        <MenuGroup>{children}</MenuGroup>
      </CollapsibleContent>
    </Collapsible>
  </MenuGroup>
);
