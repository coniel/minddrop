import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text } from '../Text';
import './WorkspaceNavItem.css';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../Collapsible';

export interface WorkspaceNavItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children rendered inside a collapsible container.
   * Typically the workspace's workspace nav items.
   */
  children?: React.ReactNode;

  /**
   * The workspace name.
   */
  label: string;

  /**
   * The workspace icon.
   */
  icon?: React.ReactNode;

  /**
   * Action buttons show on hover.
   */
  actions?: React.ReactNode;

  /**
   * If `true`, the nav item will have 'active' styling.
   */
  active?: boolean;

  /**
   * If `true`, the nav item will have 'missing' styling.
   */
  missing?: boolean;

  /**
   * Callback fired when the nav item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * The open state of the collapsible children when it is initially
   * rendered. Use when you do not need to control its open state.
   */
  defaultExpanded?: boolean;

  /**
   * The controlled expanded state of the collapsible children.
   * Must be used in conjunction with `onExpandedChange`.
   */
  expanded?: boolean;

  /**
   * Event handler called when the open state of the
   * collapsible children changes.
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Bit of a hack to enable hover styling when options menu
   * is open.
   */
  hovering?: boolean;
}

export const WorkspaceNavItem = React.forwardRef<
  HTMLDivElement,
  WorkspaceNavItemProps
>(
  (
    {
      active,
      children,
      className,
      defaultExpanded,
      expanded,
      icon,
      actions,
      label,
      missing,
      hovering,
      onExpandedChange,
      ...other
    },
    ref,
  ) => {
    return (
      <Collapsible
        asChild
        defaultOpen={defaultExpanded}
        open={expanded}
        onOpenChange={onExpandedChange}
      >
        <div
          ref={ref}
          className={mapPropsToClasses(
            { className, active, missing },
            'workspace-nav-item',
          )}
          {...other}
        >
          <div
            className={mapPropsToClasses({ className, hovering }, 'nav-item')}
            {...other}
          >
            {icon && <div className="icon">{icon}</div>}
            <CollapsibleTrigger>
              <Text
                as="div"
                role="button"
                aria-current={active ? 'true' : 'false'}
                color="light"
                weight="medium"
                className="label"
                size="regular"
              >
                {label}
              </Text>
            </CollapsibleTrigger>
            <div className="actions">{actions}</div>
          </div>
          <CollapsibleContent>{children}</CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
);

WorkspaceNavItem.displayName = 'WorkspaceNavItem';
