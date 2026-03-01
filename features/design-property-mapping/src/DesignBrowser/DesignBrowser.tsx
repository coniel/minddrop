import { useCallback, useEffect } from 'react';
import {
  Design,
  DesignElement,
  Designs,
  defaultDesignIds,
} from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
  OpenMainContentViewEvent,
} from '@minddrop/events';
import {
  DesignCanvas,
  DesignElementWrapperProvider,
  DesignRootElement,
} from '@minddrop/feature-designs';
import { PropertySchema } from '@minddrop/properties';
import { DropEventData } from '@minddrop/selection';
import { Button, Panel } from '@minddrop/ui-primitives';
import { useDesignPropertyMappingStore } from '../DesignPropertyMappingStore';
import { PropertyDropTarget } from '../PropertyDropTarget';
import { DatabasePropertiesDataKey } from '../constants';
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
  // Read UI state from the store
  const view = useDesignPropertyMappingStore((state) => state.view);
  const selectedDesignId = useDesignPropertyMappingStore(
    (state) => state.designId,
  );
  const selectDesign = useDesignPropertyMappingStore(
    (state) => state.selectDesign,
  );
  const setView = useDesignPropertyMappingStore((state) => state.setView);
  const mapProperty = useDesignPropertyMappingStore(
    (state) => state.mapProperty,
  );

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
      selectDesign(firstDesign.id);
    }
  }, [selectDesign]);

  // Fetch the selected design
  const selectedDesign = Designs.use(selectedDesignId || '');

  // Handle selecting a design in the list
  const handleSelectDesign = useCallback(
    (design: Design) => {
      selectDesign(design.id);
    },
    [selectDesign],
  );

  // Switch to the property mapping view
  const handleUseDesign = useCallback(() => {
    setView('map-properties');
  }, [setView]);

  // Handle a property being dropped onto a design element
  const handlePropertyDrop = useCallback(
    (elementId: string, drop: DropEventData) => {
      // Extract the property schema from the drop data
      const data = drop.data as Record<string, unknown>;
      const properties = data[DatabasePropertiesDataKey] as
        | PropertySchema[]
        | undefined;

      if (!properties || properties.length === 0) {
        return;
      }

      // Map the first property to the element
      mapProperty(elementId, properties[0].name);
    },
    [mapProperty],
  );

  // Wrapper function for design elements in mapping mode
  const elementWrapper = useCallback(
    (element: DesignElement, children: React.ReactNode) => (
      <PropertyDropTarget element={element} onDrop={handlePropertyDrop}>
        {children}
      </PropertyDropTarget>
    ),
    [handlePropertyDrop],
  );

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
            onBack={() => {
              setView('browse');
            }}
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
                {view === 'map-properties' ? (
                  <DesignElementWrapperProvider
                    wrapper={elementWrapper}
                    excludeTypes={['root', 'container']}
                  >
                    <DesignRootElement element={selectedDesign.tree} />
                  </DesignElementWrapperProvider>
                ) : (
                  <DesignRootElement element={selectedDesign.tree} />
                )}
              </DesignCanvas>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
