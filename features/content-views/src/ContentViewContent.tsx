import { ContentView } from '@minddrop/content-views';
import { useContentViewEntries } from '@minddrop/ui-content-views';
import { ContentViewRenderer } from './ContentViewRenderer';

export interface ContentViewContentProps {
  /**
   * The content view to render.
   */
  contentView: ContentView;
}

/**
 * Renders a content view's contents, populated with the entries
 * provided by its data source.
 */
export const ContentViewContent: React.FC<ContentViewContentProps> = ({
  contentView,
}) => {
  // Entries from whichever data source the view uses
  const entries = useContentViewEntries(contentView);

  return <ContentViewRenderer view={contentView} entries={entries} />;
};
