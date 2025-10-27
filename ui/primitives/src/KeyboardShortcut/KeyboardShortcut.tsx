import { FC } from 'react';
import { Text, TextProps } from '../Text';
import { mapPropsToClasses } from '../utils';

export interface KeyboardShortcutProps extends Omit<TextProps, 'children'> {
  /**
   * The shortcut keys. 'Ctrl' and 'Alt' keys will render as ⌘ and ⌥ respectively on Macs.
   */
  keys: string[];
}

/**
 * Turns an array of key names into a keyboard shortcut string.
 * Replaces 'Ctrl' with ⌘ and 'Alt' with '⌥' on Macs.
 */
export function printKeyboardShortcut(keys: string[]): string {
  let shortcut = keys.join('');

  const isMac =
    typeof navigator !== 'undefined' &&
    navigator.platform.toLowerCase().indexOf('mac') === 0;

  if (isMac) {
    shortcut = shortcut.replace('Ctrl', '⌘');
    shortcut = shortcut.replace('Alt', '⌥');
    shortcut = shortcut.replace('Shift', '⇧');
    shortcut = shortcut.replace('Enter', '⏎');
  }

  return shortcut;
}

export const KeyboardShortcut: FC<KeyboardShortcutProps> = ({
  className,
  keys,
  ...other
}) => (
  <Text
    className={mapPropsToClasses({ className }, 'keyboard-shortcut')}
    {...other}
  >
    {printKeyboardShortcut(keys)}
  </Text>
);
