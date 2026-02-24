import { FC } from 'react';
import { Text, TextProps } from '../Text';
import { propsToClass } from '../utils';
import './KeyboardShortcut.css';

export interface KeyboardShortcutProps extends Omit<TextProps, 'children'> {
  /*
   * The shortcut keys to display.
   *
   * Use 'Mod' for the primary modifier — renders as '⌘' on Mac, 'Ctrl' on
   * Windows/Linux. 'Alt' renders as '⌥' on Mac. 'Shift' and 'Enter' render
   * as '⇧' and '⏎' on Mac respectively.
   */
  keys: string[];
}

/**
 * Returns true if the current platform is macOS.
 */
function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Modern API
  if ('userAgentData' in navigator) {
    return (
      navigator as Navigator & { userAgentData: { platform: string } }
    ).userAgentData.platform
      .toLowerCase()
      .includes('mac');
  }

  // Fallback
  return navigator.userAgent.toLowerCase().includes('mac');
}

/**
 * Turns an array of key names into a keyboard shortcut string.
 * On Mac, applies platform-appropriate symbol substitutions.
 */
export function printKeyboardShortcut(keys: string[]): string {
  if (!isMac()) return keys.join('');

  return keys
    .map((key) => {
      switch (key) {
        case 'Mod':
          return '⌘';
        case 'Ctrl':
          return '⌘';
        case 'Alt':
          return '⌥';
        case 'Shift':
          return '⇧';
        case 'Enter':
          return '⏎';
        default:
          return key;
      }
    })
    .join('');
}

export const KeyboardShortcut: FC<KeyboardShortcutProps> = ({
  className,
  keys,
  ...other
}) => (
  <Text
    mono
    className={propsToClass('keyboard-shortcut', { className })}
    {...other}
  >
    {printKeyboardShortcut(keys)}
  </Text>
);
