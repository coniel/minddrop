import React from 'react';

export interface RTTriggerCharacterConfig {
  /**
   * The character which trigger the action.
   */
  character: string;

  /**
   * The callback fired when the trigger charater is typed
   * into the editor.
   */
  action: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}
