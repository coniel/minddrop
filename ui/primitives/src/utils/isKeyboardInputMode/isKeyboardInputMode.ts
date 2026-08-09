import { INPUT_MODE_ATTRIBUTE } from '../../constants';

/**
 * Whether the user is currently interacting via the keyboard, as
 * tracked by `initializeInputModalityTracking`. False until the
 * first interaction.
 */
export function isKeyboardInputMode(): boolean {
  return (
    document.documentElement.getAttribute(INPUT_MODE_ATTRIBUTE) === 'keyboard'
  );
}
