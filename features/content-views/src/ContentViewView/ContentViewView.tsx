import { ContentViews } from '@minddrop/content-views';
import { PanelView } from '@minddrop/ui-components';
import {
  ContentViewFilterMenu,
  ContentViewSettingsMenu,
  ContentViewSortMenu,
} from '@minddrop/ui-content-views';
import { ContentViewContent } from '../ContentViewContent';
import { ContentViewRenderer } from '../ContentViewRenderer';
import './ContentViewView.css';

export interface ContentViewViewProps {
  /**
   * The ID of the content view to display.
   */
  contentViewId: string;
}

/**
 * Renders a content view as a standalone page in a panel. Renders a
 * missing view notice when the content view no longer exists.
 */
export const ContentViewView: React.FC<ContentViewViewProps> = ({
  contentViewId,
}) => {
  const contentView = ContentViews.use(contentViewId);

  // Notice shown when the content view no longer exists
  if (!contentView) {
    return (
      <div className="content-view-view">
        <PanelView className="content-view-view-panel">
          <ContentViewRenderer viewDeleted />
        </PanelView>
      </div>
    );
  }

  return (
    <div className="content-view-view">
      <PanelView
        stringTitle={contentView.name}
        contentIcon={contentView.icon}
        className="content-view-view-panel"
        actions={[
          <ContentViewFilterMenu key="filter" view={contentView} />,
          <ContentViewSortMenu key="sort" view={contentView} />,
          <ContentViewSettingsMenu key="options" view={contentView} />,
        ]}
      >
        <ContentViewContent contentView={contentView} />
      </PanelView>
    </div>
  );
};
