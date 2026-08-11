import React from 'react';
import { UiIconName } from '@minddrop/ui-icons';
import { ContentIcon } from '../ContentIcon';
import { Icon } from '../Icon';
import { propsToClass } from '../utils';
import './FloatingToolbar.css';

export interface FloatingToolbarCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The name of the UI icon rendered in the card.
   */
  icon?: UiIconName;

  /**
   * The stringified content icon rendered in the card, used when
   * the card represents a thing with an icon of its own. Takes
   * priority over `icon`.
   */
  contentIcon?: string;

  /**
   * The card's contents, for cards which render something other
   * than an icon. Ignored when an icon is provided.
   */
  children?: React.ReactNode;

  /**
   * Whether the card is currently being dragged, during which it
   * is dimmed to read as a stand-in for the dragged item.
   */
  dragging?: boolean;

  /**
   * Class name applied to the card element.
   */
  className?: string;
}

/**
 * Renders a draggable card in a floating toolbar, representing a
 * thing which is created in the view by dragging the card into
 * it.
 */
export const FloatingToolbarCard: React.FC<FloatingToolbarCardProps> =
  React.forwardRef<HTMLDivElement, FloatingToolbarCardProps>(
    (
      { icon, contentIcon, children, dragging = false, className, ...other },
      ref,
    ) => (
      <div
        ref={ref}
        className={propsToClass('floating-toolbar-card', {
          dragging,
          className,
        })}
        {...other}
      >
        <CardContent icon={icon} contentIcon={contentIcon}>
          {children}
        </CardContent>
      </div>
    ),
  );

FloatingToolbarCard.displayName = 'FloatingToolbarCard';

type CardContentProps = Pick<
  FloatingToolbarCardProps,
  'icon' | 'contentIcon' | 'children'
>;

/**
 * Renders the card's icon, falling back to its children when it
 * has none.
 */
const CardContent: React.FC<CardContentProps> = ({
  icon,
  contentIcon,
  children,
}) => {
  // A content icon takes priority, being specific to the thing
  // the card represents
  if (contentIcon) {
    return <ContentIcon icon={contentIcon} />;
  }

  if (icon) {
    return <Icon name={icon} color="regular" />;
  }

  return <>{children}</>;
};
