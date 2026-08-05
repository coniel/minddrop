import { useEffect } from 'react';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
  SetNavToolbarWidthEvent,
} from '@minddrop/events';
import {
  DesignStudioStore,
  ElementStyleEditor,
  LayoutEditSurface,
  LayoutEditorLeftPanel,
  clearLayoutEditor,
  deleteHighlightedElement,
  initializeLayoutEditor,
  useDesignStudioStore,
} from '@minddrop/feature-designs';
import { Space, Spaces } from '@minddrop/spaces';
import { PanelView } from '@minddrop/ui-components';
import { Panel, ScrollArea } from '@minddrop/ui-primitives';
import { setSpaceViewState } from '../SpaceViewStateStore';
import { EDIT_PANEL_WIDTH, PAGE_ELEMENT_TYPES } from '../constants';
import './SpaceEditMode.css';

export interface SpaceEditModeProps {
  /**
   * The space being edited.
   */
  space: Space;
}

/**
 * Renders the in-place space editor: the layout editor panels
 * around the space's editable layout. Every edit persists to the
 * space immediately.
 */
export const SpaceEditMode: React.FC<SpaceEditModeProps> = ({ space }) => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );

  // Initialize the layout editor session for the space's layout,
  // persisting edits to the space. The session owns the layout
  // while mounted, so it must not re-initialize on layout saves.
  useEffect(() => {
    initializeLayoutEditor(space.layout, {
      onSave: async (layout) => {
        await Spaces.update(space.id, { layout });
      },
    });

    return () => {
      clearLayoutEditor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [space.id]);

  // Swap the app sidebar for the edit panels
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);
    Events.dispatch(SetNavToolbarWidthEvent, { width: EDIT_PANEL_WIDTH });

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
      Events.dispatch(SetNavToolbarWidthEvent, { width: 0 });
    };
  }, []);

  // Keyboard shortcuts: delete the highlighted element, deselect
  // or exit edit mode on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't act while typing in an input
      const tag = (event.target as HTMLElement).tagName;

      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }

      // The global selection shortcut prevents the default for
      // delete keys, so deletion must not respect defaultPrevented
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const { highlightedElementId } = DesignStudioStore.getState();

        // Nothing highlighted to delete
        if (!highlightedElementId) {
          return;
        }

        event.preventDefault();

        // The space's root layout cannot be deleted
        deleteHighlightedElement();

        return;
      }

      // Open popovers stop Escape's propagation when dismissing,
      // so it only arrives here when nothing consumed it
      if (event.key === 'Escape') {
        // Deselect the highlighted element, or exit edit mode
        if (DesignStudioStore.getState().highlightedElementId) {
          DesignStudioStore.getState().selectElement(null);
        } else {
          setSpaceViewState(space.id, { editing: false });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [space.id]);

  function handleExitEditMode() {
    setSpaceViewState(space.id, { editing: false });
  }

  return (
    <div className="space-edit-mode">
      <Panel className="space-edit-mode-left-panel">
        <LayoutEditorLeftPanel
          backButtonLabel="spaces.view.actions.exitEditMode"
          onClickBack={handleExitEditMode}
          elementTypes={PAGE_ELEMENT_TYPES}
          showViews={false}
        />
      </Panel>
      {/* The space's editable layout */}
      <PanelView
        className="space-edit-mode-surface"
        stringTitle={space.name}
        contentIcon={space.icon}
      >
        <ScrollArea className="space-edit-mode-content">
          <LayoutEditSurface layoutId={space.layout.id} />
        </ScrollArea>
      </PanelView>
      <Panel className="space-edit-mode-right-panel">
        {selectedElementId && <ElementStyleEditor />}
      </Panel>
    </div>
  );
};
