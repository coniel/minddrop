import { DataView, DataViewTypes } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import { PanelView } from '@minddrop/ui-components';
import { UiIconName } from '@minddrop/ui-icons';
import { CloseViewEvent } from '@minddrop/views';
import { DataViewRenderer } from '../DataViewRenderer';
import { NewDataViewViewId, OpenDataViewViewEvent } from '../events';
import './NewDataViewView.css';

export interface NewDataViewViewProps {
  /**
   * The type of data view to create.
   */
  viewType: string;
}

/**
 * Renders a data view creation form for the given view type in a
 * panel.
 */
export const NewDataViewView: React.FC<NewDataViewViewProps> = ({
  viewType,
}) => {
  const viewTypeConfig = DataViewTypes.use(viewType);

  // Open the created data view's view and close this one
  function handleCreateView(view: DataView) {
    Events.dispatch(OpenDataViewViewEvent, {
      dataViewId: view.id,
    });

    Events.dispatch(CloseViewEvent, {
      id: NewDataViewViewId,
    });
  }

  return (
    <div className="new-data-view-view">
      <PanelView
        icon={(viewTypeConfig?.icon as UiIconName) || 'plus'}
        title="dataViews.labels.new"
        className="new-data-view-view-panel"
      >
        <DataViewRenderer
          createViewType={viewType}
          onCreateView={handleCreateView}
        />
      </PanelView>
    </div>
  );
};
