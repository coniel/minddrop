import React, { useMemo } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { Text } from '../Text';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../Collapsible';
import './TopicNavItem.css';

export interface TopicNavItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children rendered inside a collapsible container.
   * Typically the topic's subtopic nav items.
   */
  children?: React.ReactNode;

  /**
   * The topic name.
   */
  label: string;

  /**
   * Internal prop not intended to be set manually.
   *
   * The nesting level of the topic starting from 0 for
   * top level topics, adding 1 for each subtopic nexting level.
   */
  level?: number;

  /**
   * If `true`, the nav item will have active styling.
   */
  active?: boolean;

  /**
   * Callback fired when the non-toggle part of the nav
   * item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * The open state of the collapsible subtopics list when it is initially
   * rendered. Use when you do not need to control its open state.
   */
  defaultExpanded?: boolean;

  /**
   * The controlled expanded state of the collapsible subtopics list.
   * Must be used in conjunction with `onExpandedChange`.
   */
  expanded?: boolean;

  /**
   * Event handler called when the open state of the
   * collapsible subtopics list changes.
   */
  onExpandedChange?: (expanded: boolean) => void;
}

export const TopicNavItem = React.forwardRef<HTMLDivElement, TopicNavItemProps>(
  (
    {
      children,
      className,
      defaultExpanded,
      expanded,
      onExpandedChange,
      active,
      label,
      level = 0,
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
          className={mapPropsToClasses({ className }, 'topic-nav-item')}
          {...other}
        >
          <div className={mapPropsToClasses({ active }, 'item')}>
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
                aria-label={t('expandSubtopics') as string}
              >
                <Icon
                  name="chevron-right"
                  color="light"
                  className="toggle-icon has-subtopics"
                />
              </div>
            </CollapsibleTrigger>
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
          <CollapsibleContent asChild>
            <div className="children">{children}</div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
);

TopicNavItem.displayName = 'TopicNavItem';
