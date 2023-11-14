import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { Text } from '../Text';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../Collapsible';
import './PageNavItem.css';

export interface PageNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children rendered inside a collapsible container.
   * Typically the page's subpage nav items.
   */
  children?: React.ReactNode;

  /**
   * The page name.
   */
  label: string;

  /**
   * The page icon.
   */
  icon?: React.ReactNode;

  /**
   * Internal prop not intended to be set manually.
   *
   * The nesting level of the page starting from 0 for
   * top level pages, adding 1 for each subpage nexting level.
   */
  level?: number;

  /**
   * If `true`, the nav item will have active styling.
   */
  active?: boolean;

  /**
   * If `true`, the nav item expand icon will have darker styling.
   */
  hasSubpages?: boolean;

  /**
   * Callback fired when the non-toggle part of the nav
   * item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * The open state of the collapsible subpages list when it is initially
   * rendered. Use when you do not need to control its open state.
   */
  defaultExpanded?: boolean;

  /**
   * The controlled expanded state of the collapsible subpages list.
   * Must be used in conjunction with `onExpandedChange`.
   */
  expanded?: boolean;

  /**
   * Event handler called when the open state of the
   * collapsible subpages list changes.
   */
  onExpandedChange?: (expanded: boolean) => void;
}

export const PageNavItem = React.forwardRef<HTMLDivElement, PageNavItemProps>(
  (
    {
      children,
      className,
      defaultExpanded,
      expanded,
      onExpandedChange,
      active,
      label,
      icon,
      level = 0,
      hasSubpages,
      onClick,
      ...other
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const title = label || t('untitled');

    return (
      <Collapsible
        asChild
        defaultOpen={defaultExpanded}
        open={expanded}
        onOpenChange={onExpandedChange}
      >
        <div
          ref={ref}
          className={mapPropsToClasses({ className }, 'page-nav-item')}
          {...other}
        >
          <div className={mapPropsToClasses({ active }, 'nav-item')}>
            {level > 0 && (
              <div
                role="button"
                aria-hidden="true"
                className="spacer-button"
                tabIndex={-1}
                onClick={onClick}
                style={{ paddingLeft: level * 16, height: 24 }}
              />
            )}
            <CollapsibleTrigger>
              <div
                role="button"
                tabIndex={0}
                className="toggle-button"
                aria-label={t('expandSubpages') as string}
              >
                <Icon
                  name="chevron-right"
                  className={mapPropsToClasses({ hasSubpages }, 'toggle-icon')}
                />
              </div>
            </CollapsibleTrigger>
            <div className="page-icon">{icon}</div>
            <div
              role="button"
              tabIndex={0}
              className="label-button"
              onClick={onClick}
              aria-current={active ? 'true' : 'false'}
            >
              <Text
                as="div"
                color="light"
                weight="medium"
                className="label"
                size="regular"
              >
                {title}
              </Text>
            </div>
          </div>
          <CollapsibleContent>{children}</CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
);

PageNavItem.displayName = 'PageNavItem';
