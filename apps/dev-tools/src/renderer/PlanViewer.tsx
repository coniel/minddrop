import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PlanViewer.css';

interface PlanViewerProps {
  /**
   * The display name of the plan.
   */
  name: string;

  /**
   * The markdown content of the plan.
   */
  content: string;
}

/**
 * Renders a plan's markdown content with full formatting.
 */
export const PlanViewer: React.FC<PlanViewerProps> = ({ name, content }) => {
  return (
    <div className="plan-viewer">
      <div className="plan-viewer-toolbar">
        <div className="plan-viewer-name">{name}</div>
      </div>

      <div className="plan-viewer-content">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    </div>
  );
};
