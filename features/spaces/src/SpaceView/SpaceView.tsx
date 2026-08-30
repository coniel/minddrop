import { DesignsIcon } from '@minddrop/designs';
import { Spaces } from '@minddrop/spaces';
import { PanelView } from '@minddrop/ui-components';
import { Text } from '@minddrop/ui-primitives';
import { SpaceContent } from '../SpaceContent';
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
 * Renders a space's layout in a panel view with an edit mode
 * toggle action in the header toolbar.
 */
export const SpaceView: React.FC<SpaceViewProps> = ({ spaceId }) => {
  const space = Spaces.use(spaceId);
  const { editing } = useSpaceViewState(spaceId);

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
      <PanelView
        className="space-view-panel"
        stringTitle={space.name}
        contentIcon={space.icon}
        actions={[
          {
            icon: DesignsIcon,
            label: 'spaces.view.actions.edit',
            tooltip: { title: 'spaces.view.actions.edit' },
            onClick: handleEdit,
          },
        ]}
      >
        {/* The space's layout */}
        <SpaceContent space={space} />
      </PanelView>
    </div>
  );
};
