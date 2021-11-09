import React, { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import { Text, TextProps } from '../Text';

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
  let shortcut = keys.join('+');

  const isMac = navigator.platform.toLowerCase().indexOf('mac') === 0;

  if (isMac) {
    shortcut = shortcut.replace('Ctrl', '⌘');
    shortcut = shortcut.replace('Alt', '⌥');
  }

  return shortcut;
}

export const KeyboardShortcut: FC<KeyboardShortcutProps> = ({
  children,
  className,
  keys,
  ...other
}) => {
  return (
    <Text
      className={mapPropsToClasses({ className }, 'keyboard-shortcut')}
      {...other}
    >
      {printKeyboardShortcut(keys)}
    </Text>
  );
};
