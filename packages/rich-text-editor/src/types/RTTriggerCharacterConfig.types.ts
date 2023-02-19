import React from 'react';

export interface RTTriggerCharacterConfig {
  /**
   * The characters which trigger the action.
   */
  characters: string[];

  /**
   * The callback fired when a charater is typed
   * into the editor.
   */
  action: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}
