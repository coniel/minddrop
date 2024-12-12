import isHotkey from 'is-hotkey';
import { Editor, MarkConfig } from '../types';

interface ParsedMarkHotkey {
  key: string;
  isHotkey(event: React.KeyboardEvent): boolean;
  value: boolean | string | number;
}

/**
 * Parses a mark config's hotkeys for more efficient runtime
 * hotkey matching.
 *
 * @param markConfig - The mark config.
 * @returns An array of parsed mark hotkey configs.
 */
function parseMarkHotkeys(markConfig: MarkConfig): ParsedMarkHotkey[] {
  const hotkeys = markConfig.hotkeys || [];

  return hotkeys.map((markHotkey) => ({
    key: markConfig.key,
    isHotkey: isHotkey(markHotkey.keys.join('+')),
    value: markHotkey.value ?? true,
  }));
}

/**
 * Returns an `onKeyDown` event handler which toggles
 * marks when the key-down event matches a configured
 * mark hotkey.
 *
 * @param editor - An editor instance.
 * @param markConfigs - The configs of marks enabled for the editor.
 * @returns An onKeyDown handler for the Editable component.
 */
export function withMarkHotkeys(
  editor: Editor,
  markConfigs: MarkConfig[],
): (event: React.KeyboardEvent<HTMLDivElement>) => boolean {
  // Do something useful
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    const parsedMarkHotkeys: ParsedMarkHotkey[] = markConfigs
      .filter((markConfig) => !!markConfig.hotkeys)
      .reduce<
        ParsedMarkHotkey[]
      >((hotkeys, markConfig) => [...hotkeys, ...parseMarkHotkeys(markConfig)], []);

    // Attempt to match the keydown event to a mark hotkey
    return !parsedMarkHotkeys.every((parsedHotkey) => {
      if (!parsedHotkey.isHotkey(event)) {
        // If the hotkey doesn't match, move on to
        // the next one.
        return true;
      }

      // Hotkey was a match, toggle the mark
      editor.toggleMark(parsedHotkey.key, parsedHotkey.value);

      // Stop here
      return false;
    });
  };
}
