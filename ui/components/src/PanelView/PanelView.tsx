import React from 'react';
import { Events, OpenViewEvent, OpenViewEventData } from '@minddrop/events';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  Button,
  ContentIcon,
  Group,
  Icon,
  IconButton,
  IconProp,
  IconRenderer,
  Panel,
  Text,
  Toolbar,
  TranslatableNode,
  propsToClass,
} from '@minddrop/ui-primitives';
import './PanelView.css';

export interface PanelViewAction {
  /**
   * The name of the icon rendered in the action button.
   */
  icon: UiIconName;

  /**
   * Accessible label announced by screen readers.
   * Translated via i18n before being applied.
   */
  label: TranslationKey;

  /**
   * Prevents interaction with the action.
   */
  disabled?: boolean;

  /**
   * Click handler.
   */
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- props shape is defined by the target view
export interface PanelViewBreadcrumb<TProps = any> {
  /**
   * Title text. Strings are treated as i18n keys and translated.
   */
  title?: TranslatableNode;

  /**
   * Plain string title rendered as-is without i18n translation.
   * Takes priority over `title`.
   */
  stringTitle?: string;

  /**
   * Icon rendered before the title.
   */
  icon?: IconProp;

  /**
   * Stringified content icon rendered before the title.
   * Takes priority over `icon`.
   */
  contentIcon?: string;

  /**
   * Identifier for the view type opened when the breadcrumb is
   * clicked.
   */
  view: string;

  /**
   * Instance id of the opened view.
   */
  viewId?: string;

  /**
   * Props passed to the opened view component.
   */
  props?: TProps;
}

export interface PanelViewProps {
  /**
   * Title text. Strings are treated as i18n keys and translated.
   */
  title?: TranslatableNode;

  /**
   * Plain string title rendered as-is without i18n translation.
   * Takes priority over `title`.
   */
  stringTitle?: string;

  /**
   * Icon rendered before the title.
   */
  icon?: IconProp;

  /**
   * Stringified content icon rendered before the title.
   * Takes priority over `icon`.
   */
  contentIcon?: string;

  /**
   * Breadcrumbs rendered before the title, linking to ancestor
   * views.
   */
  breadcrumbs?: PanelViewBreadcrumb[];

  /**
   * Action buttons rendered in the header toolbar.
   */
  actions?: PanelViewAction[];

  /**
   * The view content.
   */
  children?: React.ReactNode;

  /**
   * Class name applied to the panel element.
   */
  className?: string;
}

/**
 * Renders a panel with a header (breadcrumbs, icon, title and
 * action buttons) above arbitrary view content.
 */
export const PanelView: React.FC<PanelViewProps> = ({
  actions,
  breadcrumbs,
  children,
  className,
  contentIcon,
  icon,
  stringTitle,
  title,
}) => {
  const { t } = useTranslation();

  // Whether the header renders a breadcrumb trail
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  // Resolve the display title, treating string titles as i18n keys
  let resolvedTitle: React.ReactNode = title;

  if (stringTitle) {
    resolvedTitle = stringTitle;
  } else if (typeof title === 'string') {
    resolvedTitle = t(title);
  }

  return (
    <Panel className={propsToClass('panel-view', { className })}>
      <Group
        justify="between"
        className={propsToClass('header', { breadcrumbs: hasBreadcrumbs })}
      >
        <Group gap={2} className="title">
          {/* Breadcrumb trail leading to the current view */}
          {breadcrumbs &&
            breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.viewId || index}>
                <PanelViewBreadcrumbButton breadcrumb={breadcrumb} />
                <Icon
                  name="chevron-right"
                  color="muted"
                  className="breadcrumb-separator"
                />
              </React.Fragment>
            ))}
          {/* Content icon takes priority over the plain icon */}
          {contentIcon ? (
            <ContentIcon className="title-icon" icon={contentIcon} />
          ) : (
            <IconRenderer className="title-icon" icon={icon} />
          )}
          <Text>{resolvedTitle}</Text>
        </Group>
        {/* Header action buttons */}
        {actions && actions.length > 0 && (
          <Toolbar>
            {actions.map((action) => (
              <IconButton
                key={action.label}
                icon={action.icon}
                label={action.label}
                color="neutral"
                disabled={action.disabled}
                onClick={action.onClick}
              />
            ))}
          </Toolbar>
        )}
      </Group>
      {children}
    </Panel>
  );
};

interface PanelViewBreadcrumbButtonProps {
  /**
   * The breadcrumb to render.
   */
  breadcrumb: PanelViewBreadcrumb;
}

/**
 * Renders a clickable breadcrumb (icon and title) which opens the
 * breadcrumb's view when clicked.
 */
const PanelViewBreadcrumbButton: React.FC<PanelViewBreadcrumbButtonProps> = ({
  breadcrumb,
}) => {
  const { t } = useTranslation();

  // Resolve the display title, treating string titles as i18n keys
  let resolvedTitle: React.ReactNode = breadcrumb.title;

  if (breadcrumb.stringTitle) {
    resolvedTitle = breadcrumb.stringTitle;
  } else if (typeof breadcrumb.title === 'string') {
    resolvedTitle = t(breadcrumb.title);
  }

  // Open the breadcrumb's view
  function handleClick() {
    Events.dispatch<OpenViewEventData>(OpenViewEvent, {
      view: breadcrumb.view,
      id: breadcrumb.viewId,
      props: breadcrumb.props,
      // The opened view's tab title must be a plain string
      title: typeof resolvedTitle === 'string' ? resolvedTitle : undefined,
      icon: breadcrumb.contentIcon,
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="breadcrumb-button"
      onClick={handleClick}
    >
      {/* Content icon takes priority over the plain icon */}
      {breadcrumb.contentIcon ? (
        <ContentIcon
          className="breadcrumb-icon"
          icon={breadcrumb.contentIcon}
        />
      ) : (
        <IconRenderer className="breadcrumb-icon" icon={breadcrumb.icon} />
      )}
      {resolvedTitle}
    </Button>
  );
};
