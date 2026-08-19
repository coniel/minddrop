import { Design } from '@minddrop/designs';
import { CanvasToolbar, useFitOnNodesReady } from '@minddrop/ui-canvas';
import { Icon } from '@minddrop/ui-primitives';
import { DesignStudioPreviewProvider } from '../DesignStudioPreviewContext';
import { DesignStudioPreviewToolbar } from '../DesignStudioPreviewToolbar';
import { DesignStudioRootElement } from '../DesignStudioRootElement';
import {
  useActiveLayout,
  useDesignStudio,
  useElement,
} from '../DesignStudioStore';
import { DesignStudioViewport } from '../DesignStudioViewport';
import { LayoutFrame } from '../LayoutFrame';
import { LayoutNameField } from '../LayoutNameField';
import { FlatRootDesignElement } from '../types';
import { useCanvasViewPersistence } from './useCanvasViewPersistence';

export interface DesignStudioWorkspaceProps {
  /**
   * The design open in the studio.
   */
  design: Design;
}

/**
 * Renders the studio workspace: the canvas viewport with the
 * design's layout frames, its name field and canvas toolbar, all
 * within the studio's preview settings. Must be rendered within
 * the studio's CanvasProvider.
 */
export const DesignStudioWorkspace: React.FC<DesignStudioWorkspaceProps> = ({
  design,
}) => {
  return (
    <DesignStudioPreviewProvider>
      <WorkspaceCanvas design={design} />
    </DesignStudioPreviewProvider>
  );
};

/**
 * Renders the workspace canvas area.
 */
const WorkspaceCanvas: React.FC<DesignStudioWorkspaceProps> = ({ design }) => {
  const studio = useDesignStudio();
  const activeLayout = useActiveLayout();

  // Return to the view the studio was left on, e.g. after a tab
  // switch
  const restoredView = useCanvasViewPersistence();

  // Fit the design's layouts into view when the workspace opens
  // without a view to return to
  useFitOnNodesReady(
    design.layouts.map((layout) => layout.id),
    !restoredView,
  );

  return (
    <div className="designs-studio-workspace">
      <DesignStudioViewport
        name={design.name}
        onNameChange={studio.renameDesign}
        nameAccessory={
          activeLayout && (
            <>
              {/** The open layout trails the design name as a
               * breadcrumb **/}
              <Icon name="chevron-right" color="muted" />
              <LayoutNameField layout={activeLayout} />
            </>
          )
        }
      >
        {design.layouts.map((layout) => (
          <LayoutFrame key={layout.id} layoutId={layout.id}>
            <LayoutRootElement />
          </LayoutFrame>
        ))}
      </DesignStudioViewport>

      {/* Canvas controls, with the preview controls to their left */}
      <CanvasToolbar>
        <DesignStudioPreviewToolbar />
      </CanvasToolbar>
    </div>
  );
};

/**
 * Renders the root element of the layout provided by the
 * surrounding layout frame's context.
 */
const LayoutRootElement: React.FC = () => {
  const rootElement = useElement<FlatRootDesignElement>('root');

  if (!rootElement) {
    return null;
  }

  return <DesignStudioRootElement element={rootElement} />;
};
