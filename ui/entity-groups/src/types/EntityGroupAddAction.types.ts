import React from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { EntityGroupAddPopoverContext } from './EntityGroupPopoverContext.types';

export interface EntityGroupAddAction {
  /**
   * Called when the group's add button is clicked, e.g. to open a
   * creation dialog.
   */
  onClick?: () => void;

  /**
   * The popover the group's add button opens, anchored via the given
   * context.
   */
  popover?: (context: EntityGroupAddPopoverContext) => React.ReactNode;

  /**
   * Label and tooltip of the add button.
   *
   * @default 'actions.new'
   */
  label?: TranslationKey;
}
