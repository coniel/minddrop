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
import { Page, Pages } from '@minddrop/pages';
import { Panel, ScrollArea } from '@minddrop/ui-primitives';
import { setPageViewState } from '../PageViewStateStore';
import { EDIT_PANEL_WIDTH, PAGE_ELEMENT_TYPES } from '../constants';
import './PageEditMode.css';

export interface PageEditModeProps {
  /**
   * The page being edited.
   */
  page: Page;
}

/**
 * Renders the in-place page editor: the layout editor panels
 * around the page's editable layout. Every edit persists to the
 * page immediately.
 */
export const PageEditMode: React.FC<PageEditModeProps> = ({ page }) => {
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );

  // Initialize the layout editor session for the page's layout,
  // persisting edits to the page. The session owns the layout
  // while mounted, so it must not re-initialize on layout saves.
  useEffect(() => {
    initializeLayoutEditor(page.layout, {
      onSave: async (layout) => {
        await Pages.update(page.id, { layout });
      },
    });

    return () => {
      clearLayoutEditor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id]);

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

        // The page's root layout cannot be deleted
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
          setPageViewState(page.id, { editing: false });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [page.id]);

  function handleExitEditMode() {
    setPageViewState(page.id, { editing: false });
  }

  return (
    <div className="page-edit-mode">
      <Panel className="page-edit-mode-left-panel">
        <LayoutEditorLeftPanel
          backButtonLabel="pages.view.actions.exitEditMode"
          onClickBack={handleExitEditMode}
          elementTypes={PAGE_ELEMENT_TYPES}
          showViews={false}
        />
      </Panel>
      {/* The page's editable layout */}
      <ScrollArea className="page-edit-mode-surface">
        <LayoutEditSurface layoutId={page.layout.id} />
      </ScrollArea>
      <Panel className="page-edit-mode-right-panel">
        {selectedElementId && <ElementStyleEditor />}
      </Panel>
    </div>
  );
};
