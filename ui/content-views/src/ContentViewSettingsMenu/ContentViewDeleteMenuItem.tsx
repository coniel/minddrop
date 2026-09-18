import React from 'react';
import { ContentView, ContentViews } from '@minddrop/content-views';
import { Events } from '@minddrop/events';
import { DropdownMenuItem } from '@minddrop/ui-primitives';

export interface ContentViewDeleteMenuItemProps {
  /**
   * The content view the item deletes.
   */
  view: ContentView;
}

/**
 * Renders the menu item deleting a content view, confirmed in a
 * dialog first.
 */
export const ContentViewDeleteMenuItem: React.FC<
  ContentViewDeleteMenuItemProps
> = ({ view }) => {
  // Confirm the deletion before removing the view
  function handleDelete() {
    Events.dispatch(Events.events.OpenConfirmationDialog, {
      title: 'contentViews.delete.confirmation.title',
      message: 'contentViews.delete.confirmation.message',
      confirmLabel: 'contentViews.delete.confirmation.confirm',
      danger: true,
      onConfirm: () => {
        ContentViews.delete(view.id);
      },
    });
  }

  return (
    <DropdownMenuItem
      icon="trash"
      danger
      label="contentViews.actions.delete"
      onSelect={handleDelete}
    />
  );
};
