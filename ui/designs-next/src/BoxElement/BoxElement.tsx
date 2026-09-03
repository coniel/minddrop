import { DesignElementProps } from '../types';
import './BoxElement.css';

/**
 * Renders the placeholder box element as an empty skeleton-styled
 * block.
 */
export const BoxElement: React.FC<DesignElementProps> = () => {
  return <div className="design-box-element" />;
};
