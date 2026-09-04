import { DesignElementProps } from '@minddrop/designs-next';
import { joinClasses } from '@minddrop/ui-primitives';
import { BoxElement } from './BoxElement.types';
import './BoxElementRenderer.css';

/**
 * Renders the decorative box element as a surface block styled by
 * its background settings.
 */
export const BoxElementRenderer: React.FC<DesignElementProps<BoxElement>> = ({
  element,
}) => {
  // The background settings modifier classes
  const className = joinClasses(
    'design-box-element',
    `design-box-element-background-${element.background ?? 'subtle'}`,
    `design-box-element-radius-${element.cornerRadius ?? 'sm'}`,
  );

  return <div className={className} />;
};
