import { useCallback, useEffect, useState } from 'react';
import { Design, Designs, defaultDesignIds } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
  OpenMainContentViewEvent,
} from '@minddrop/events';
import { DesignCanvas, DesignRootElement } from '@minddrop/feature-designs';
import { Button, Panel } from '@minddrop/ui-primitives';
import { DatabasePropertyList } from './DatabasePropertyList';
import { DesignBrowserList } from './DesignBrowserList';
import './DesignBrowser.css';

export interface DesignBrowserProps {
  /**
   * The ID of the database to browse designs for.
   */
  databaseId: string;

  /**
   * The event to dispatch when navigating back.
   */
  backEvent?: string;

  /**
   * The data to pass with the back event.
   */
  backEventData?: Record<string, unknown>;
}

export const DesignBrowser: React.FC<DesignBrowserProps> = ({
  databaseId,
  backEvent,
  backEventData,
}) => {
  // Current view: browsing designs or mapping properties
  const [view, setView] = useState<'browse' | 'map-properties'>('browse');
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  // Close the app sidebar when the design browser is opened
  useEffect(() => {
    Events.dispatch(CloseAppSidebarEvent);

    return () => {
      Events.dispatch(OpenAppSidebarEvent);
    };
  }, []);

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

  // Switch to the property mapping view
  const handleUseDesign = useCallback(() => {
    setView('map-properties');
  }, []);

  // Navigate back to the previous view
  const handleClickBack = useCallback(() => {
    if (backEvent) {
      Events.dispatch(backEvent, backEventData);
    } else {
      // No back event provided, navigate to an empty view
      Events.dispatch(OpenMainContentViewEvent, {
        component: () => null,
      });
    }
  }, [backEvent, backEventData]);

  return (
    <div className="design-browser">
      {/* List panel */}
      <Panel className="design-browser-list-panel">
        {view === 'browse' ? (
          <DesignBrowserList
            databaseId={databaseId}
            selectedDesignId={selectedDesignId}
            onSelectDesign={handleSelectDesign}
            onClose={handleClickBack}
          />
        ) : (
          <DatabasePropertyList
            databaseId={databaseId}
            onBack={() => setView('browse')}
          />
        )}
      </Panel>

      {/* Preview panel showing the design rendered in a canvas */}
      <div className="design-browser-preview-panel">
        {selectedDesign && (
          <>
            {/* Action bar at the top of the workspace */}
            {view === 'browse' && (
              <div className="design-browser-action-bar">
                <Button
                  label="design-property-mapping.browser.useDesign"
                  variant="solid"
                  color="primary"
                  size="lg"
                  onClick={handleUseDesign}
                />
              </div>
            )}

            {/* Canvas area for the design preview */}
            <div className="design-browser-canvas-area">
              <DesignCanvas designType={selectedDesign.type}>
                <DesignRootElement element={selectedDesign.tree} />
              </DesignCanvas>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
