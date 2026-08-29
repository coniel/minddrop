import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewElement } from '@minddrop/designs';
import {
  DataViewRenderer,
  useDataViewEntries,
} from '@minddrop/feature-data-views';
import { useDesignProperties } from '../../DesignPropertiesProvider';
import { useDesignStudio } from '../../DesignStudioStore';
import { useElementCssStyle } from '../../useElementCssStyle';
import './DataViewDesignElement.css';

export interface DataViewDesignElementProps {
  /**
   * The data view element to render.
   */
  element: DataViewElement;
}

/**
 * Display renderer for a data view design element, rendering the
 * data view referenced by its content. An element without a data
 * view renders the creation form; a dangling reference renders the
 * missing view notice.
 */
export const DataViewDesignElement: React.FC<DataViewDesignElementProps> = ({
  element,
}) => {
  const studio = useDesignStudio(false);
  const designProperties = useDesignProperties();

  // The referenced data view
  const dataView = DataViews.use(element.content ?? '');
  const entries = useDataViewEntries(dataView);

  const cssStyle = useElementCssStyle(element);

  // Write the created data view's ID onto the element, through the
  // layout editor session when one owns the element
  function handleCreateDataView(createdDataView: DataView) {
    if (studio) {
      studio.updateDesignElement<DataViewElement>(element.id, {
        content: createdDataView.id,
      });

      return;
    }

    designProperties?.onUpdateElementContent?.(element.id, createdDataView.id);
  }

  return (
    <div className="designs-data-view-element" style={cssStyle}>
      <DataViewRenderer
        showHeader
        view={dataView ?? undefined}
        viewDeleted={Boolean(element.content && !dataView)}
        createViewType={element.dataViewType}
        onCreateView={handleCreateDataView}
        entries={entries}
      />
    </div>
  );
};
