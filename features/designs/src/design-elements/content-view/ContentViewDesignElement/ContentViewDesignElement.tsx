import { ContentView, ContentViews } from '@minddrop/content-views';
import { ContentViewElement } from '@minddrop/designs';
import { ContentViewRenderer } from '@minddrop/feature-content-views';
import { useContentViewEntries } from '@minddrop/ui-content-views';
import { useDesignProperties } from '../../../DesignPropertiesProvider';
import { useDesignStudio } from '../../../DesignStudioStore';
import { useElementCssStyle } from '../../../useElementCssStyle';
import './ContentViewDesignElement.css';

export interface ContentViewDesignElementProps {
  /**
   * The content view element to render.
   */
  element: ContentViewElement;
}

/**
 * Display renderer for a content view design element, rendering the
 * content view referenced by its content. An element without a data
 * view renders the creation form; a dangling reference renders the
 * missing view notice.
 */
export const ContentViewDesignElement: React.FC<
  ContentViewDesignElementProps
> = ({ element }) => {
  const studio = useDesignStudio(false);
  const designProperties = useDesignProperties();

  // The referenced content view
  const contentView = ContentViews.use(element.content ?? '');
  const entries = useContentViewEntries(contentView);

  const cssStyle = useElementCssStyle(element);

  // Write the created content view's ID onto the element, through the
  // layout editor session when one owns the element.
  function handleCreateContentView(createdContentView: ContentView) {
    if (studio) {
      studio.updateDesignElement<ContentViewElement>(element.id, {
        content: createdContentView.id,
      });

      return;
    }

    designProperties?.onUpdateElementContent?.(
      element.id,
      createdContentView.id,
    );
  }

  return (
    <div className="designs-content-view-element" style={cssStyle}>
      <ContentViewRenderer
        view={contentView ?? undefined}
        viewDeleted={Boolean(element.content && !contentView)}
        createViewType={element.contentViewType}
        onCreateView={handleCreateContentView}
        entries={entries}
      />
    </div>
  );
};
