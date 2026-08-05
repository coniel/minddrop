import React from 'react';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import {
  ContentIcon,
  Group,
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
 * Renders a panel with a header (icon, title and action buttons)
 * above arbitrary view content.
 */
export const PanelView: React.FC<PanelViewProps> = ({
  actions,
  children,
  className,
  contentIcon,
  icon,
  stringTitle,
  title,
}) => {
  const { t } = useTranslation();

  // Resolve the display title, treating string titles as i18n keys
  let resolvedTitle: React.ReactNode = title;

  if (stringTitle) {
    resolvedTitle = stringTitle;
  } else if (typeof title === 'string') {
    resolvedTitle = t(title);
  }

  return (
    <Panel className={propsToClass('panel-view', { className })}>
      <Group justify="between" className="header">
        <Group gap={2} className="title">
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
