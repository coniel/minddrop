import React from 'react';
import {
  OpenViewEvent,
  OpenViewEventData,
  ViewDescriptor,
} from '@minddrop/events';
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
import { Views } from '@minddrop/views';
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
   * views. Defaults to the trail of the view instance the panel
   * is rendered in.
   */
  breadcrumbs?: ViewDescriptor[];

  /**
   * Content rendered in place of the header's breadcrumbs, icon and
   * title, filling the header's available width.
   */
  header?: React.ReactNode;

  /**
   * Action buttons rendered in the header toolbar. Items may be
   * action descriptors or custom React elements rendered as-is.
   */
  actions?: (PanelViewAction | React.ReactElement)[];

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
  header,
  icon,
  stringTitle,
  title,
}) => {
  const { t } = useTranslation();
  const contextBreadcrumbs = Views.useBreadcrumbs();

  // Explicitly passed breadcrumbs override the view instance's trail
  const trail = breadcrumbs ?? contextBreadcrumbs;

  // Whether the header renders a breadcrumb trail
  const hasBreadcrumbs = trail.length > 0;

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
        {/* Custom header content replaces the title entirely */}
        {header ? (
          <div className="header-content">{header}</div>
        ) : (
          <Group gap={2} className="title">
            {/* Breadcrumb trail leading to the current view */}
            {trail.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.id || index}>
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
        )}
        {/* Header action buttons */}
        {actions && actions.length > 0 && (
          <Toolbar>
            {actions.map((action, index) => {
              // Render custom action elements as provided
              if (React.isValidElement(action)) {
                return <React.Fragment key={index}>{action}</React.Fragment>;
              }

              return (
                <IconButton
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                  color="neutral"
                  disabled={action.disabled}
                  onClick={action.onClick}
                />
              );
            })}
          </Toolbar>
        )}
      </Group>
      {children}
    </Panel>
  );
};

interface PanelViewBreadcrumbButtonProps {
  /**
   * The descriptor of the ancestor view the breadcrumb links to.
   */
  breadcrumb: ViewDescriptor;
}

/**
 * Renders a clickable breadcrumb (icon and title) which opens the
 * breadcrumb's view when clicked.
 */
const PanelViewBreadcrumbButton: React.FC<PanelViewBreadcrumbButtonProps> = ({
  breadcrumb,
}) => {
  const { t } = useTranslation();
  const openView = Views.useOpenView();
  const registered = Views.use(breadcrumb.view);

  // The crumb's own content icon, falling back to the view's
  // registered UI icon
  const icon: IconProp | undefined = breadcrumb.icon ? (
    <ContentIcon icon={breadcrumb.icon} />
  ) : (
    registered?.icon
  );

  // The crumb's own title, falling back to the view's registered one
  const title =
    breadcrumb.title ?? (registered?.title ? t(registered.title) : undefined);

  // Open the breadcrumb's view
  function handleClick() {
    openView<OpenViewEventData>(OpenViewEvent, { ...breadcrumb });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="breadcrumb-button"
      onClick={handleClick}
    >
      <IconRenderer className="breadcrumb-icon" icon={icon} />
      {title}
    </Button>
  );
};
