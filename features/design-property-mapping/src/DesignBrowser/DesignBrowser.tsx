import { useCallback, useEffect, useState } from 'react';
import { Design, Designs, defaultDesignIds } from '@minddrop/designs';
import { DesignCanvas, DesignRootElement } from '@minddrop/feature-designs';
import { Panel } from '@minddrop/ui-primitives';
import { DesignBrowserList } from './DesignBrowserList';
import './DesignBrowser.css';

export interface DesignBrowserProps {
  /**
   * The ID of the database to browse designs for.
   */
  databaseId: string;

  /**
   * Callback fired when a design is selected for mapping.
   */
  onSelectDesign: (designId: string) => void;

  /**
   * Callback fired when the browser is closed.
   */
  onClose: () => void;
}

export const DesignBrowser: React.FC<DesignBrowserProps> = ({
  databaseId,
  onSelectDesign,
  onClose,
}) => {
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  // Auto-select the first non-default design on mount
  useEffect(() => {
    const designs = Designs.Store.getAll();
    const firstDesign = designs.find(
      (design) => !defaultDesignIds.includes(design.id),
    );

    if (firstDesign) {
      setSelectedDesignId(firstDesign.id);
    }
  }, []);

  // Fetch the selected design
  const selectedDesign = Designs.use(selectedDesignId || '');

  // Handle selecting a design in the list
  const handleSelectDesign = useCallback((design: Design) => {
    setSelectedDesignId(design.id);
  }, []);

  return (
    <Panel className="design-browser">
      {/* List panel */}
      <div className="design-browser-list-panel">
        <DesignBrowserList
          databaseId={databaseId}
          selectedDesignId={selectedDesignId}
          onSelectDesign={handleSelectDesign}
          onClose={onClose}
        />
      </div>

      {/* Preview panel showing the design rendered in a canvas */}
      <div className="design-browser-preview-panel">
        {selectedDesign && (
          <DesignCanvas designType={selectedDesign.type}>
            <DesignRootElement element={selectedDesign.tree} />
          </DesignCanvas>
        )}
      </div>
    </Panel>
  );
};
