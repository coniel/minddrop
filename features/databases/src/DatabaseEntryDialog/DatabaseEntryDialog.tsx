import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  DatabaseEntries,
  Databases,
  OpenDatabaseEntryViewEvent,
} from '@minddrop/databases';
import { DropdownMenu, FloatingActionButton } from '@minddrop/ui-primitives';
import { DatabaseEntryOptionsMenu } from '../DatabaseEntryOptionsMenu';
import { DatabaseEntryRenderer } from '../DatabaseEntryRenderer';
import { CornerHandle } from './CornerHandle';
import { useDialogResize } from './useDialogResize';
import { useDialogSize } from './useDialogSize';
import './DatabaseEntryDialog.css';
import { Events } from '@minddrop/events';

export interface DatabaseEntryDialogProps {
  /**
   * Whether the dialog is open.
   */
  open: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * The ID of the database entry to render.
   */
  entryId: string;
}

/**
 * Renders a database entry in a dialog overlay with a resizable
 * canvas. The canvas is always centered and resizes are mirrored
 * from the center.
 */
export const DatabaseEntryDialog: React.FC<DatabaseEntryDialogProps> = ({
  open,
  onOpenChange,
  entryId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Get the entry so we can resolve the dialog layout ID
  const entry = DatabaseEntries.use(entryId);

  // Resolve the dialog layout ID for the entry's database
  const databaseId = entry?.database ?? null;
  const layoutId = useMemo(() => {
    if (!databaseId) {
      return null;
    }

    try {
      return Databases.getDefaultLayout(databaseId, 'dialog')?.id ?? null;
    } catch {
      return null;
    }
  }, [databaseId]);

  // Dialog size management (init, persistence, window resize adaptation)
  const { size, setSize, sizeRef, baseSizeRef } = useDialogSize(open, layoutId);

  // Corner-drag resize handling
  const { handleResizeMouseDown } = useDialogResize(
    open,
    size,
    setSize,
    layoutId,
    sizeRef,
    baseSizeRef,
  );

  // Close the dialog when pressing Escape
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't close when Escape is pressed inside an editable element.
      // The first press should blur/deselect within the field instead.
      const target = event.target as HTMLElement;

      if (
        target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleOpenNewTab = useCallback(() => {
    onOpenChange(false);
    Events.dispatch(OpenDatabaseEntryViewEvent, {
      entryId,
      openMode: 'new-tab',
    });
  }, [entryId, onOpenChange]);

  const handleOpenSplit = useCallback(() => {
    onOpenChange(false);
    Events.dispatch(OpenDatabaseEntryViewEvent, {
      entryId,
      openMode: 'split',
    });
  }, [entryId, onOpenChange]);

  // Close the dialog when clicking the backdrop or a hover zone
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        target === backdropRef.current ||
        target.classList.contains('database-entry-dialog-hover-zone')
      ) {
        handleClose();
      }
    },
    [handleClose],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      ref={backdropRef}
      className="database-entry-dialog-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        ref={canvasRef}
        className="database-entry-dialog-canvas"
        style={{ width: size.width, height: size.height }}
      >
        {/* Corner resize handles */}
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-top-left" />
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-top-left-vertical" />
        <CornerHandle
          corner="top-left"
          onMouseDown={(event) => handleResizeMouseDown(event, 'top-left')}
        />
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-top-right" />
        <CornerHandle
          corner="top-right"
          onMouseDown={(event) => handleResizeMouseDown(event, 'top-right')}
        />
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-bottom-left" />
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-bottom-left-vertical" />
        <CornerHandle
          corner="bottom-left"
          onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-left')}
        />
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-bottom-right" />
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-bottom-right-vertical" />
        <CornerHandle
          corner="bottom-right"
          onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-right')}
        />

        {/* Content wrapper */}
        <div className="database-entry-dialog-content">
          <DatabaseEntryRenderer entryId={entryId} layoutContext="dialog" />
        </div>

        {/* Previous entry navigation button */}
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-left">
          <FloatingActionButton
            className="database-entry-dialog-nav-button database-entry-dialog-nav-button-previous"
            icon="chevron-left"
            label="databases.entries.actions.previousEntry"
          />
        </div>

        {/* Next entry navigation button */}
        <div className="database-entry-dialog-hover-zone database-entry-dialog-hover-zone-right">
          <FloatingActionButton
            className="database-entry-dialog-nav-button database-entry-dialog-nav-button-next"
            icon="chevron-right"
            label="databases.entries.actions.nextEntry"
          />
        </div>

        {/* Actions toolbar */}
        <div className="database-entry-dialog-toolbar">
          <FloatingActionButton
            icon="x"
            label="actions.close"
            tooltip={{ title: 'actions.close' }}
            onClick={handleClose}
          />
          <FloatingActionButton
            icon="maximize-2"
            label="databases.entries.actions.openInNewTab"
            tooltip={{ title: 'databases.entries.actions.openInNewTab' }}
            onClick={handleOpenNewTab}
          />
          <FloatingActionButton
            tooltip={{ title: 'databases.entries.actions.openInSplitView' }}
            icon="split-square-horizontal"
            label="databases.entries.actions.openInSplitView"
            onClick={handleOpenSplit}
          />
          <DropdownMenu
            trigger={
              <FloatingActionButton
                icon="ellipsis-vertical"
                label="databases.entries.actions.entryOptions"
                tooltip={{ title: 'databases.entries.actions.entryOptions' }}
              />
            }
            side="right"
            align="start"
          >
            <DatabaseEntryOptionsMenu entryId={entryId} />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
