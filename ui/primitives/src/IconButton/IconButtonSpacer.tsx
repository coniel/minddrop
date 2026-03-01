import { IconButtonSize } from './IconButton';

export interface IconButtonSpacerProps {
  /**
   * Must match the size of the IconButton it balances.
   * @default 'md'
   */
  size?: IconButtonSize;
}

/**
 * Renders an invisible block sized to match an IconButton,
 * useful for balancing flex layouts without layout shift.
 */
export const IconButtonSpacer: React.FC<IconButtonSpacerProps> = ({
  size = 'md',
}) => {
  return <div className={`icon-button icon-button-size-${size}`} />;
};
