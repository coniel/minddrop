import { usePage } from '@minddrop/pages';
import './PageView.css';

export interface PageViewProps {
  /**
   * The page path.
   */
  path: string;
}

export const PageView: React.FC<PageViewProps> = ({ path }) => {
  const page = usePage(path);

  if (!page) {
    return null;
  }

  return <div className="page-view">{page.contentRaw}</div>;
};
