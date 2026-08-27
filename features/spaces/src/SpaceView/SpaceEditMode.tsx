import { useEffect, useState } from 'react';
import { Designs } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
  SetNavToolbarWidthEvent,
} from '@minddrop/events';
import {
  DesignStudioProvider,
  DesignStudioScope,
  DesignStudioStore,
  ElementStyleEditor,
  LayoutEditSurface,
  LayoutsPanel,
  createDesignStudioStore,
  useActiveLayout,
  useDesignStudio,
  useDesignStudioStore,
} from '@minddrop/feature-designs';
import { Space, resolveSpaceMediaDirPath } from '@minddrop/spaces';
import { PanelView } from '@minddrop/ui-components';
import { IconButton, Panel, ScrollArea } from '@minddrop/ui-primitives';
import { setSpaceViewState } from '../SpaceViewStateStore';
import { EDIT_PANEL_WIDTH } from '../constants';
import './SpaceEditMode.css';

export interface SpaceEditModeProps {
  /**
   * The space being edited.
   */
  space: Space;

  /**
   * The studio store instance backing the editor session.
   * Defaults to a new instance per mount.
   */
  studio?: DesignStudioStore;
}

/**
 * Renders the in-place space editor: the layout editor panels
 * around the space's editable layout. Every edit persists to the
 * space immediately.
 */
export const SpaceEditMode: React.FC<SpaceEditModeProps> = ({
  space,
  studio: providedStudio,
}) => {
  // Studio store instance scoped to this editing session
  const [studio] = useState(() => providedStudio ?? createDesignStudioStore());

  return (
    <DesignStudioProvider store={studio}>
      <SpaceEditSession space={space} />
    </DesignStudioProvider>
  );
};

type SpaceEditSessionProps = Pick<SpaceEditModeProps, 'space'>;

/**
 * Renders the editing session within the studio store provider:
 * the layouts panel, the editable layout surface and the element
 * style editor.
 */
const SpaceEditSession: React.FC<SpaceEditSessionProps> = ({ space }) => {
  const studio = useDesignStudio();
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );
  const design = useDesignStudioStore((state) => state.design);
  const layout = useActiveLayout();

  // Initialize the layout editor session for the space's layout,
  // persisting edits through the space's design. The session owns
  // the layout while mounted, so it must not re-initialize on
  // layout saves.
  useEffect(() => {
    studio.initializeLayoutEditor(space.design.layouts[0], {
      onSave: async (updatedLayout) => {
        await Designs.update(space.design.id, { layouts: [updatedLayout] });
      },
      mediaDirPath: resolveSpaceMediaDirPath(space.id),
    });

    return () => {
      studio.clearLayoutEditor();
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
        // Nothing highlighted to delete
        if (!studio.getHighlightedElementId()) {
          return;
        }

        event.preventDefault();

        // The space's root layout cannot be deleted
        studio.deleteHighlightedElement();

        return;
      }

      // Open popovers stop Escape's propagation when dismissing,
      // so it only arrives here when nothing consumed it
      if (event.key === 'Escape') {
        // Deselect the highlighted element, or exit edit mode
        if (studio.getHighlightedElementId()) {
          studio.selectElement(null);
        } else {
          setSpaceViewState(space.id, { editing: false });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [space.id, studio]);

  function handleExitEditMode() {
    setSpaceViewState(space.id, { editing: false });
  }

  // Nothing to render until the editor session is initialized
  if (!design || !layout) {
    return null;
  }

  return (
    <DesignStudioScope design={design}>
      <div className="space-edit-mode">
        <Panel className="space-edit-mode-left-panel">
          {/** Exit edit mode header **/}
          <div className="space-edit-mode-left-header">
            <IconButton
              icon="arrow-left"
              label="spaces.view.actions.exitEditMode"
              tooltip={{ title: 'spaces.view.actions.exitEditMode' }}
              color="neutral"
              onClick={handleExitEditMode}
            />
          </div>
          {/** Layout element tree and elements palette **/}
          <LayoutsPanel />
        </Panel>
        {/* The space's editable layout */}
        <PanelView
          className="space-edit-mode-surface"
          stringTitle={space.name}
          contentIcon={space.icon}
        >
          <ScrollArea className="space-edit-mode-content">
            <LayoutEditSurface layoutId={layout.id} />
          </ScrollArea>
        </PanelView>
        <Panel className="space-edit-mode-right-panel">
          {selectedElementId && <ElementStyleEditor />}
        </Panel>
      </div>
    </DesignStudioScope>
  );
};
