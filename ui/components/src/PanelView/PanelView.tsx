import React from 'react';
import { Events } from '@minddrop/events';
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
  TooltipProps,
  TranslatableNode,
  propsToClass,
} from '@minddrop/ui-primitives';
import { Breadcrumb, Views } from '@minddrop/views';
import './PanelView.css';

// The number of crumbs a header shows, dropping the furthest
const MAX_BREADCRUMBS = 3;

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
   * Tooltip shown on hover.
   */
  tooltip?: Omit<TooltipProps, 'children'>;

  /**
   * Prevents interaction with the action.
   */
  disabled?: boolean;

  /**
   * Click handler.
   */
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface PanelViewBackAction {
  /**
   * Accessible label announced by screen readers.
   * Translated via i18n before being applied.
   */
  label: TranslationKey;

  /**
   * Tooltip shown on hover.
   */
  tooltip?: Omit<TooltipProps, 'children'>;

  /**
   * Hides the button while keeping its space, so header content
   * does not shift when the back action comes and goes.
   */
  hidden?: boolean;

  /**
   * Click handler.
   */
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface PanelViewProps {
  /**
   * Renders a back arrow button at the start of the header. The
   * button provides part of the header's leading inset, replacing
   * a portion of its padding.
   */
  backAction?: PanelViewBackAction;

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
   * Breadcrumbs rendered before the title, overriding the trail of
   * views the panel's view was reached through. Panels nested within
   * a view pass an empty trail, the view's own being shown by the
   * panel it is rendered in.
   */
  breadcrumbs?: Breadcrumb[];

  /**
   * Whether the view can show no subview, making its own crumb lead
   * out of the subview it shows. Views which always show one (e.g. a
   * list falling back to its first item) set this to false, rendering
   * the crumb as a plain label.
   *
   * @default true
   */
  clearableSubview?: boolean;

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
  backAction,
  breadcrumbs,
  children,
  className,
  clearableSubview = true,
  contentIcon,
  header,
  icon,
  stringTitle,
  title,
}) => {
  const { t } = useTranslation();
  const navigationTrail = Views.useBreadcrumbs();

  // Show the nearest crumbs only, keeping long trails within the
  // header's width.
  const trail = (breadcrumbs ?? navigationTrail).slice(-MAX_BREADCRUMBS);

  // Resolve the display title, treating string titles as i18n keys
  let resolvedTitle: React.ReactNode = title;

  if (stringTitle) {
    resolvedTitle = stringTitle;
  } else if (typeof title === 'string') {
    resolvedTitle = t(title);
  }

  return (
    <Panel className={propsToClass('panel-view', { className })}>
      <Group justify="between" className="panel-view-header">
        {/* Back arrow navigating out of the current header context */}
        {backAction && (
          <IconButton
            icon="arrow-left"
            label={backAction.label}
            tooltip={backAction.tooltip}
            color="neutral"
            onClick={backAction.onClick}
            className={propsToClass('panel-view-back-button', {
              hidden: backAction.hidden,
            })}
          />
        )}
        {/* Custom header content replaces the title entirely */}
        {header ? (
          <div className="panel-view-header-content">{header}</div>
        ) : (
          <Group gap={2} className="panel-view-title">
            {/* The views the current view was reached through, each
                leading back to its point in the history */}
            {trail.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                <PanelViewBreadcrumb
                  breadcrumb={breadcrumb}
                  clearableSubview={clearableSubview}
                />
                <Icon
                  name="chevron-right"
                  color="muted"
                  className="panel-view-breadcrumb-separator"
                />
              </React.Fragment>
            ))}
            {/* Content icon takes priority over the plain icon */}
            {contentIcon ? (
              <ContentIcon
                className="panel-view-title-icon"
                icon={contentIcon}
              />
            ) : (
              <IconRenderer className="panel-view-title-icon" icon={icon} />
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
                  tooltip={action.tooltip}
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

interface PanelViewBreadcrumbProps {
  /**
   * The breadcrumb to render.
   */
  breadcrumb: Breadcrumb;

  /**
   * Whether the crumb of the view currently shown clears the view's
   * subview when clicked, rather than rendering as a plain label.
   */
  clearableSubview: boolean;
}

/**
 * Renders a breadcrumb (icon and title) which navigates back to the
 * view it leads to. The crumb of the view currently shown carries no
 * history position and instead clears the subview the view shows,
 * or is a plain label when the subview cannot be cleared.
 */
const PanelViewBreadcrumb: React.FC<PanelViewBreadcrumbProps> = ({
  breadcrumb,
  clearableSubview,
}) => {
  const { t } = useTranslation();
  const pane = Views.useViewPane();
  const setSubview = Views.useSetSubview();
  const registered = Views.use(breadcrumb.view);

  // The crumb's own icon, falling back to the view's registered one
  const icon = resolveBreadcrumbIcon(breadcrumb, registered?.icon);

  // The crumb's own title, falling back to the view's registered one
  const title =
    breadcrumb.title ?? (registered?.title ? t(registered.title) : undefined);

  // Navigate back to the crumb's point in the history, or out of the
  // subview when the crumb is the view already shown.
  function handleClick() {
    if (!breadcrumb.steps) {
      setSubview(null);

      return;
    }

    Events.dispatch(Views.events.NavigateBack, {
      steps: breadcrumb.steps,
      viewAreaId: pane?.viewAreaId,
    });
  }

  // The crumb leads to the view already shown, which cannot leave
  // its subview.
  if (!breadcrumb.steps && !clearableSubview) {
    return (
      <Group gap={2} className="panel-view-breadcrumb-label">
        <IconRenderer className="panel-view-breadcrumb-icon" icon={icon} />
        <Text color="muted">{title}</Text>
      </Group>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="panel-view-breadcrumb-button"
      onClick={handleClick}
    >
      <IconRenderer className="panel-view-breadcrumb-icon" icon={icon} />
      {title}
    </Button>
  );
};

/**
 * Resolves the icon a crumb renders: the content icon of the entity
 * it shows, its own icon otherwise, falling back to the view's
 * registered icon.
 *
 * @param breadcrumb - The crumb to icon.
 * @param registeredIcon - The icon of the view the crumb leads to.
 * @returns The icon to render, if any.
 */
function resolveBreadcrumbIcon(
  breadcrumb: Breadcrumb,
  registeredIcon: UiIconName | undefined,
): IconProp | undefined {
  if (breadcrumb.contentIcon) {
    return <ContentIcon icon={breadcrumb.contentIcon} />;
  }

  return breadcrumb.icon ?? registeredIcon;
}
