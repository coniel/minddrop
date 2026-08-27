import { useRef } from 'react';
import { DesignPreviewProvider } from '../DesignElements';
import { DesignStudioRootElement } from '../DesignStudioRootElement';
import { useElement } from '../DesignStudioStore';
import { LayoutIdProvider } from '../LayoutIdContext';
import { SelectionOverlay } from '../SelectionOverlay';
import { FlatRootDesignElement } from '../types';
import './LayoutEditSurface.css';

export interface LayoutEditSurfaceProps {
  /**
   * The ID of the layout being edited.
   */
  layoutId: string;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

/**
 * Renders a single layout as an editable design studio surface,
 * without the studio's canvas or layout frames.
 */
export const LayoutEditSurface: React.FC<LayoutEditSurfaceProps> = ({
  layoutId,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`designs-layout-edit-surface${className ? ` ${className}` : ''}`}
      data-layout-id={layoutId}
    >
      <LayoutIdProvider value={layoutId}>
        <DesignPreviewProvider value>
          <RootElement />
        </DesignPreviewProvider>
      </LayoutIdProvider>
      <SelectionOverlay transformLayerRef={containerRef} />
    </div>
  );
};

/**
 * Renders the root element of the layout provided by the
 * surrounding layout ID context.
 */
const RootElement: React.FC = () => {
  const rootElement = useElement<FlatRootDesignElement>('root');

  if (!rootElement) {
    return null;
  }

  return <DesignStudioRootElement element={rootElement} />;
};
