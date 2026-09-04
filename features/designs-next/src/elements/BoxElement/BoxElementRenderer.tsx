import { DesignElementProps } from '@minddrop/ui-designs-next';
import './BoxElementRenderer.css';

/**
 * Renders the decorative box element as a plain surface block.
 * Styling settings (background colour, blur) come with the settings
 * groups.
 */
export const BoxElementRenderer: React.FC<DesignElementProps> = () => {
  return <div className="design-box-element" />;
};
