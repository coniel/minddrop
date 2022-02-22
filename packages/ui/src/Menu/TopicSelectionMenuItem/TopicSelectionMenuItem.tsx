import React, { ComponentType, useCallback, useMemo, useState } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './TopicSelectionMenuItem.css';
import { Collapsible, CollapsibleContent } from '../../Collapsible';
import { Text } from '../../Text';
import { Icon } from '../../Icon';
import { useTranslation } from '@minddrop/i18n';
import { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';
import { ContextMenuItemProps } from '@radix-ui/react-context-menu';

export interface TopicSelectionMenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * The component to use as the MenuItem.
   */
  MenuItemComponent: ComponentType<
    DropdownMenuItemProps | ContextMenuItemProps
  >;

  /**
   * `TopicSelectionMenuItem`s for the topic's subtopics.
   */
  children?:
    | React.ReactElement<TopicSelectionMenuItemProps>
    | React.ReactElement<TopicSelectionMenuItemProps>[];

  /**
   * The menu item's label.
   */
  label: React.ReactNode;

  /**
   * Event handler called when the user selects an item
   * (via mouse of keyboard). Calling `event.preventDefault`
   * in this handler will prevent the dropdown menu from
   * closing when selecting that item.
   */
  onSelect?: ContextMenuItemProps['onSelect'];

  /**
   * Internal prop not intended to be set manually.
   *
   * The nesting level of the topic starting from 0 for
   * top level topics, adding 1 for each subtopic nexting level.
   */
  level?: number;

  /**
   * The open state of the collapsible subtopics list when it is initially
   * rendered. Use when you do not need to control its open state.
   */
  defaultExpanded?: boolean;
}

export const TopicSelectionMenuItem = React.forwardRef<
  HTMLDivElement,
  TopicSelectionMenuItemProps
>(
  (
    {
      children,
      MenuItemComponent,
      className,
      label,
      defaultExpanded = false,
      level = 0,
      onSelect,
      ...other
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const childCount = useMemo(
      () => React.Children.toArray(children).length,
      [children],
    );
    const [expanded, setExpanded] = useState(defaultExpanded);
    const title = label || t('untitled');

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
          setExpanded(true);
        } else if (event.key === 'ArrowLeft') {
          if (expanded) {
            // Prevent default if expanded to prevent the submenu
            // closing if item is in submenu. If topic is not
            // expanded, ArrowLeft will close the submenu.
            event.preventDefault();
            setExpanded(false);
          }
        }
      },
      [expanded],
    );

    const handleClickExpand = useCallback((event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setExpanded((value) => !value);
    }, []);

    const handleSelect = useCallback(
      (event) => {
        if (onSelect) {
          onSelect(event as unknown as Event);
        }
      },
      [onSelect],
    );

    return (
      <Collapsible asChild defaultOpen={defaultExpanded} open={expanded}>
        <div
          ref={ref}
          className={mapPropsToClasses(
            { className },
            'topic-selection-menu-item',
          )}
          {...other}
        >
          <MenuItemComponent
            className="item"
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
          >
            {level > 0 && (
              <div
                role="button"
                aria-hidden="true"
                className="spacer-button"
                tabIndex={-1}
                onClick={handleSelect}
                style={{ paddingLeft: level * 16, height: 24 }}
              />
            )}
            <div
              role="button"
              tabIndex={0}
              className="toggle-button"
              data-state={expanded ? 'open' : 'closed'}
              aria-label={t('expandSubtopics')}
              onClick={handleClickExpand}
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
            <div
              role="button"
              tabIndex={0}
              className="label-button"
              onClick={handleSelect}
            >
              <Text as="div" className="label" size="regular">
                {title}
              </Text>
            </div>
          </MenuItemComponent>
          <CollapsibleContent asChild>
            <div className="children">
              {childCount > 0 ? (
                React.Children.map(children, (child) =>
                  React.cloneElement(
                    child as React.ReactElement<TopicSelectionMenuItemProps>,
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
