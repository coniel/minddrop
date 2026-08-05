import { useCallback } from 'react';
import { LayoutRenderer } from '@minddrop/feature-designs';
import { Spaces, setLayoutElementContent } from '@minddrop/spaces';
import { IconButton, Panel, ScrollArea, Text } from '@minddrop/ui-primitives';
import { setSpaceViewState, useSpaceViewState } from '../SpaceViewStateStore';
import { SpaceEditMode } from './SpaceEditMode';
import './SpaceView.css';

export interface SpaceViewProps {
  /**
   * The ID of the space to display.
   */
  spaceId: string;
}

/**
 * Renders a space's layout in a panel with an edit mode toggle
 * button.
 */
export const SpaceView: React.FC<SpaceViewProps> = ({ spaceId }) => {
  const space = Spaces.use(spaceId);
  const { editing } = useSpaceViewState(spaceId);

  // Persist element static content updates (e.g. a created view
  // reference) into the space's layout
  const handleUpdateElementContent = useCallback(
    (elementId: string, content: string) => {
      // The space cannot be updated once deleted
      if (!space) {
        return;
      }

      Spaces.update(spaceId, {
        layout: setLayoutElementContent(space.layout, elementId, content),
      });
    },
    [spaceId, space],
  );

  function handleEdit() {
    setSpaceViewState(spaceId, { editing: true });
  }

  // The space no longer exists
  if (!space) {
    return (
      <div className="space-view space-view-not-found">
        <Text color="muted" text="spaces.view.notFound" />
      </div>
    );
  }

  // Render the in-place editor while in edit mode
  if (editing) {
    return <SpaceEditMode space={space} />;
  }

  return (
    <div className="space-view">
      <Panel className="space-view-panel">
        {/* Edit mode toggle */}
        <IconButton
          icon="palette"
          label="spaces.view.actions.edit"
          tooltip={{ title: 'spaces.view.actions.edit' }}
          color="muted"
          className="space-view-edit-button"
          onClick={handleEdit}
        />
        {/* The space's layout */}
        <ScrollArea className="space-view-content">
          <LayoutRenderer
            layout={space.layout}
            context="page"
            propertyMap={{}}
            propertyValues={{}}
            properties={[]}
            onUpdateElementContent={handleUpdateElementContent}
          />
        </ScrollArea>
      </Panel>
    </div>
  );
};
