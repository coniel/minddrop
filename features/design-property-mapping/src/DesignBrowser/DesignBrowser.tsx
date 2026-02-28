import { useCallback, useEffect, useState } from 'react';
import { Design, Designs, defaultDesignIds } from '@minddrop/designs';
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

  // Handle selecting a design in the list
  const handleSelectDesign = useCallback((design: Design) => {
    setSelectedDesignId(design.id);
  }, []);

  return (
    <Panel className="design-browser">
      <DesignBrowserList
        databaseId={databaseId}
        selectedDesignId={selectedDesignId}
        onSelectDesign={handleSelectDesign}
        onClose={onClose}
      />
    </Panel>
  );
};
