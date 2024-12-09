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
import './DocumentNavItem.css';

export interface DocumentNavItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Children rendered inside a collapsible container.
   * Typically the document's subdocument nav items.
   */
  children?: React.ReactNode;

  /**
   * The document name.
   */
  label: string;

  /**
   * The document icon.
   */
  icon?: React.ReactNode;

  /**
   * Action buttons show on hover.
   */
  actions?: React.ReactNode;

  /**
   * Internal prop not intended to be set manually.
   *
   * The nesting level of the document starting from 0 for
   * top level documents, adding 1 for each subdocument nexting level.
   */
  level?: number;

  /**
   * If `true`, the nav item will have active styling.
   */
  active?: boolean;

  /**
   * If `true`, the nav item expand icon will have darker styling.
   */
  hasSubdocuments?: boolean;

  /**
   * Callback fired when the non-toggle part of the nav
   * item is clicked.
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * The open state of the collapsible subdocuments list when it is initially
   * rendered. Use when you do not need to control its open state.
   */
  defaultExpanded?: boolean;

  /**
   * The controlled expanded state of the collapsible subdocuments list.
   * Must be used in conjunction with `onExpandedChange`.
   */
  expanded?: boolean;

  /**
   * Event handler called when the open state of the
   * collapsible subdocuments list changes.
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Bit of a hack to enable hover styling when options menu
   * is open.
   */
  hovering?: boolean;
}

export const DocumentNavItem = React.forwardRef<
  HTMLDivElement,
  DocumentNavItemProps
>(
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
      actions,
      level = 0,
      hasSubdocuments,
      onClick,
      hovering,
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
          className={mapPropsToClasses({ className }, 'document-nav-item')}
          {...other}
        >
          <div className={mapPropsToClasses({ active, hovering }, 'nav-item')}>
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
                aria-label={t('expandSubdocuments') as string}
              >
                <Icon
                  name="chevron-right"
                  className={mapPropsToClasses(
                    { hasSubdocuments },
                    'toggle-icon',
                  )}
                />
              </div>
            </CollapsibleTrigger>
            <div className="document-icon">{icon}</div>
            <div
              role="button"
              tabIndex={0}
              className="label-button"
              onMouseDown={onClick}
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
            <div className="actions">{actions}</div>
          </div>
          <CollapsibleContent>{children}</CollapsibleContent>
        </div>
      </Collapsible>
    );
  },
);

DocumentNavItem.displayName = 'DocumentNavItem';
