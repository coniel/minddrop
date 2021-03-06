import React, { useMemo } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Tooltip } from '../Tooltip';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../Collapsible';
import './TopicNavItem.css';

export interface TopicNavItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `TopicNavItem`s for the topic's subtopics.
   */
  children?:
    | React.ReactElement<TopicNavItemProps>
    | React.ReactElement<TopicNavItemProps>[];

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
    const childCount = useMemo(
      () => React.Children.toArray(children).length,
      [children],
    );
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
          <Tooltip
            side="right"
            sideOffset={6}
            title={title}
            delayDuration={800}
            description={t('subtopicCount_interval', {
              postProcess: 'interval',
              count: childCount,
            })}
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
                  aria-label={t('expandSubtopics')}
                >
                  {childCount ? (
                    <Icon
                      name="toggle-filled"
                      color="light"
                      className="toggle-icon has-subtopics"
                    />
                  ) : (
                    <Icon
                      name="toggle-empty"
                      color="light"
                      className="toggle-icon no-subtopics"
                    />
                  )}
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
          </Tooltip>
          <CollapsibleContent asChild>
            <div className="children">
              {childCount > 0 ? (
                React.Children.map(children, (child) =>
                  React.cloneElement(
                    child as React.ReactElement<TopicNavItemProps>,
                    {
                      level: level + 1,
                    },
                  ),
                )
              ) : (
                <Text
                  as="div"
                  color="light"
                  className="helper-text"
                  style={{ paddingLeft: level * 16 }}
                >
                  {t('noSubtopics')}
                </Text>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
);
