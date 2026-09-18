import {
  ContentView,
  ContentViewGroups,
  ContentViewTypes,
} from '@minddrop/content-views';
import { Events } from '@minddrop/events';
import { PanelView } from '@minddrop/ui-components';
import { UiIconName } from '@minddrop/ui-icons';
import { Views } from '@minddrop/views';
import { ContentViewRenderer } from '../ContentViewRenderer';
import { NewContentViewViewId, OpenContentViewViewEvent } from '../events';
import './NewContentViewView.css';

export interface NewContentViewViewProps {
  /**
   * The type of content view to create.
   */
  viewType: string;

  /**
   * The ID of the group the created view is filed under. Omit to
   * create it in no group.
   */
  groupId?: string;
}

/**
 * Renders a content view creation form for the given view type in a
 * panel.
 */
export const NewContentViewView: React.FC<NewContentViewViewProps> = ({
  viewType,
  groupId,
}) => {
  const viewTypeConfig = ContentViewTypes.use(viewType);
  const openView = Views.useOpenView();

  // Open the created content view's view and close this one
  async function handleCreateView(view: ContentView) {
    // File the view under the group it was created from
    if (groupId) {
      await ContentViewGroups.addItem(groupId, view.id);
    }

    openView(OpenContentViewViewEvent, {
      contentViewId: view.id,
    });

    Events.dispatch(Views.events.Close, {
      id: NewContentViewViewId,
    });
  }

  return (
    <div className="new-content-view-view">
      <PanelView
        icon={(viewTypeConfig?.icon as UiIconName) || 'plus'}
        title="contentViews.labels.new"
        className="new-content-view-view-panel"
      >
        <ContentViewRenderer
          createViewType={viewType}
          onCreateView={handleCreateView}
        />
      </PanelView>
    </div>
  );
};
