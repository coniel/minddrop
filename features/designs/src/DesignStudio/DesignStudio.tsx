import { useCallback, useEffect, useRef, useState } from 'react';
import { Design, DesignId, Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import { CanvasProvider } from '@minddrop/ui-canvas';
import { isEditableTarget, useDeleteKey } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { DesignDashboard } from '../DesignDashboard';
import { DesignStudioLeftPanel } from '../DesignStudioLeftPanel';
import { DesignStudioScope } from '../DesignStudioScope';
import {
  DesignStudioProvider,
  createDesignStudioStore,
  useDesignStudio,
  useDesignStudioStore,
} from '../DesignStudioStore';
import { DesignStudioWorkspace } from '../DesignStudioWorkspace';
import { ElementStyleEditor } from '../ElementStyleEditor';
import { DesignStudioViewId, DesignStudioViewTitle } from '../constants';
import { createDesignStudioCanvasStore } from '../createDesignStudioCanvasStore';
import { DesignStudioViewProps } from '../events';
import './DesignStudio.css';
import { useSelectionPersistence } from './useSelectionPersistence';

// Width of the left panel, matched by the nav toolbar (see DesignStudio.css)
const LEFT_PANEL_WIDTH = 300;

/**
 * The design studio view. Owns the studio and canvas store
 * instances for its editing session, showing the design dashboard
 * until a design is opened.
 */
export const DesignStudio: React.FC<DesignStudioViewProps> = ({
  designId,
  fromDashboard,
}) => {
  // Store instances scoped to this studio session, so several
  // editors can be open at once.
  const [studio] = useState(createDesignStudioStore);
  const [canvasStore] = useState(createDesignStudioCanvasStore);
  // The session the sidebar is hidden for, rather than whichever is
  // active when the studio closes.
  const sessionId = Views.useSession() ?? undefined;

  // Clear the studio when it unmounts so the next open starts
  // at the dashboard, persisting any pending edit first.
  useEffect(() => {
    return () => {
      void studio.flushSave();
      studio.clear();
    };
  }, [studio]);

  // Hide the app sidebar while the design studio is open
  useEffect(() => {
    Events.dispatch(Views.events.SetSlot, {
      sessionId,
      slotId: 'sidebar',
      hidden: true,
    });

    return () => {
      Events.dispatch(Views.events.SetSlot, {
        sessionId,
        slotId: 'sidebar',
        hidden: false,
      });
    };
  }, [sessionId]);

  return (
    <DesignStudioProvider store={studio}>
      <CanvasProvider store={canvasStore}>
        <DesignStudioSession
          designId={designId}
          fromDashboard={fromDashboard}
        />
      </CanvasProvider>
    </DesignStudioProvider>
  );
};

type DesignStudioSessionProps = DesignStudioViewProps;

/**
 * Renders the studio session within the store providers: the
 * dashboard until a design is open, then the editor panels.
 */
const DesignStudioSession: React.FC<DesignStudioSessionProps> = ({
  designId,
  fromDashboard,
}) => {
  // The title last set on the view
  const viewTitle = useRef<string | null>(null);
  const { t } = useTranslation();
  const studio = useDesignStudio();
  const design = useDesignStudioStore((state) => state.design);
  const highlightedElementId = useDesignStudioStore(
    (state) => state.highlightedElementId,
  );

  // Carry the open layout and selected element across remounts,
  // which is what a tab switch does to the studio
  useSelectionPersistence();

  const isDesignOpen = Boolean(design);

  // Restore the design recorded on the view, which reopens the
  // design the studio was last on when the view remounts (e.g. on a
  // tab switch)
  useEffect(() => {
    // Look up the design, ignoring it when it no longer exists
    const openedDesign = designId ? Designs.get(designId, false) : null;

    // Nothing to restore when the studio is already on the recorded
    // design, which is the case for opens the studio made itself.
    if (studio.getDesign()?.id === openedDesign?.id) {
      return;
    }

    // No design to restore: show the dashboard
    if (!openedDesign) {
      studio.clear();

      return;
    }

    studio.initialize(openedDesign);
  }, [designId, studio]);

  // Title the view after the open design so that its tab is
  // labelled by it, falling back to the studio's own title.
  useEffect(() => {
    const title = design?.name || t(DesignStudioViewTitle);

    // Updating the view re-renders it, so the update is skipped
    // unless the title actually changed.
    if (viewTitle.current === title) {
      return;
    }

    viewTitle.current = title;

    Events.dispatch(Views.events.Update, {
      id: DesignStudioViewId,
      title,
    });
  }, [design?.name, t]);

  // Match the nav toolbar to the left panel, which is only shown
  // while a design is open.
  useEffect(() => {
    Events.dispatch(Events.events.SetNavToolbarWidth, {
      width: isDesignOpen ? LEFT_PANEL_WIDTH : 0,
    });
  }, [isDesignOpen]);

  // Undo and redo on Cmd/Ctrl+Z, clear the highlight on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle shortcuts when typing in an input
      if (isEditableTarget(event.target)) {
        return;
      }

      // Cmd/Ctrl+Z steps through the edit history, with shift
      // redoing the step it just undid.
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();

        if (event.shiftKey) {
          studio.redo();
        } else {
          studio.undo();
        }

        return;
      }

      // Escape clears the selection overlay
      if (event.key === 'Escape') {
        studio.clearHighlight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [studio]);

  // Delete the highlighted element on Delete/Backspace. Deleting a
  // frame's root deletes the entire layout.
  useDeleteKey(() => {
    studio.deleteHighlightedElement({ allowRootDelete: true });
  }, highlightedElementId !== null);

  const handleClickBack = useCallback(() => {
    // Navigate to an empty view to unmount the design studio
    // and reopen the sidebar.
    Events.dispatch(Views.events.Open, { view: Views.constants.DefaultName });
  }, []);

  // Open the design, recording it on the view so that it is
  // restored when the view remounts.
  const handleOpenDesign = useCallback(
    (openedDesign: Design) => {
      studio.initialize(openedDesign);
      setViewDesign(openedDesign.id);
    },
    [studio],
  );

  // Return to the origin view when the studio was opened directly
  // into a design, otherwise close the design to show the dashboard.
  const handleCloseDesign = useCallback(async () => {
    // Persist any pending edit before leaving the design
    await studio.flushSave();

    // Studios opened directly into a design have no dashboard to
    // return to, so they leave the studio entirely.
    if (!fromDashboard) {
      handleClickBack();

      return;
    }

    studio.clear();
    setViewDesign(undefined);
  }, [fromDashboard, handleClickBack, studio]);

  // Gate the nav override on presence rather than the design
  // itself, which changes identity on every edit.
  const hasOpenDesign = Boolean(design);

  // While a design is open, the app's nav back button closes it
  // instead of navigating the tab history.
  useEffect(() => {
    if (!hasOpenDesign) {
      return;
    }

    // Register the back action on the nav toolbar and listen for
    // its presses.
    Events.dispatch(Events.events.SetNavToolbarBackAction, {
      label: 'designsStudio.backToDesigns',
    });
    Events.addListener(
      Events.events.NavToolbarBack,
      'design-studio',
      handleCloseDesign,
    );

    return () => {
      Events.dispatch(Events.events.SetNavToolbarBackAction, null);
      Events.removeListener(Events.events.NavToolbarBack, 'design-studio');
    };
  }, [hasOpenDesign, handleCloseDesign]);

  // No design open: show the dashboard
  if (!design) {
    return (
      <DesignDashboard
        onOpenDesign={handleOpenDesign}
        onClickBack={handleClickBack}
      />
    );
  }

  return (
    <DesignStudioScope design={design}>
      <div className="designs-studio">
        <DesignStudioLeftPanel />
        <DesignStudioWorkspace design={design} />
        <ElementStyleEditor />
      </div>
    </DesignStudioScope>
  );
};

/**
 * Records the design open in the studio on the studio view, or
 * clears it when no design ID is given.
 */
function setViewDesign(designId?: DesignId): void {
  Events.dispatch(Views.events.Update, {
    id: DesignStudioViewId,
    props: { designId, fromDashboard: Boolean(designId) },
  });
}
