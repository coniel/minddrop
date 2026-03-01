import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Databases } from '@minddrop/databases';
import { Design, Designs, defaultDesignIds } from '@minddrop/designs';
import {
  CloseAppSidebarEvent,
  Events,
  OpenAppSidebarEvent,
  OpenMainContentViewEvent,
} from '@minddrop/events';
import { DesignCanvas, DesignRootElement } from '@minddrop/feature-designs';
import { useTranslation } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import {
  DropEventData,
  SelectionDragEndedEvent,
  SelectionDragStartedEvent,
  SelectionDragStartedEventData,
} from '@minddrop/selection';
import { Button, Panel, SwitchField } from '@minddrop/ui-primitives';
import { useDesignPropertyMappingStore } from '../DesignPropertyMappingStore';
import { PropertyConnectionLine } from '../PropertyConnectionLine/PropertyConnectionLine';
import { PropertyMappingOverlay } from '../PropertyMappingOverlay';
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
  const { t } = useTranslation();

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
  const setDraggingPropertyType = useDesignPropertyMappingStore(
    (state) => state.setDraggingPropertyType,
  );
  const draggingPropertyType = useDesignPropertyMappingStore(
    (state) => state.draggingPropertyType,
  );
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );

  // Database for counting total properties
  const database = Databases.use(databaseId);
  const mappedCount = Object.keys(propertyMap).length;
  const totalCount = database?.properties.length ?? 0;

  // Track property drag start/end to update the store's dragging state.
  // Listens for selection drag events dispatched by useDraggable, which
  // fire after the selection has been updated with the dragged item.
  useEffect(() => {
    if (view !== 'map-properties') {
      return;
    }

    const listenerId = 'design-property-mapping';

    // On drag start, check if a database property is being dragged
    Events.addListener<SelectionDragStartedEventData>(
      SelectionDragStartedEvent,
      listenerId,
      (event) => {
        const propertyItem = event.data.selection.find(
          (item) => item.type === DatabasePropertiesDataKey,
        );

        if (propertyItem) {
          const property = propertyItem.data as PropertySchema;

          setDraggingPropertyType(property.type);
        }
      },
    );

    // On drag end, clear the dragging state
    Events.addListener(SelectionDragEndedEvent, listenerId, () => {
      setDraggingPropertyType(null);
    });

    return () => {
      Events.removeListener(SelectionDragStartedEvent, listenerId);
      Events.removeListener(SelectionDragEndedEvent, listenerId);
    };
  }, [view, setDraggingPropertyType]);

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

  // Ref for the top-level browser container (used by connection line)
  const browserRef = useRef<HTMLDivElement>(null);

  // Ref for the canvas area container
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Whether the zoom-to-fit scaling is enabled
  const [zoomEnabled, setZoomEnabled] = useState(true);

  // Scale + translate state for the mapping view zoom.
  // Keeps the computed values so the reverse animation
  // returns to the original position smoothly.
  const [canvasScale, setCanvasScale] = useState<{
    active: boolean;
    scale: number;
    originX: number;
    originY: number;
    translateX: number;
    translateY: number;
  }>({
    active: false,
    scale: 1,
    originX: 0,
    originY: 0,
    translateX: 0,
    translateY: 0,
  });

  // Calculate the optimal scale and centering offset when entering
  // map-properties view. Measures the canvas position within the area,
  // computes the largest scale (capped at 1.5) that fits when centered,
  // and translates the canvas to the workspace center.
  // Uses useLayoutEffect so the measurement happens after DOM updates
  // but before the browser paints, avoiding a visible jump.
  useLayoutEffect(() => {
    // Deactivate scaling when not in mapping view or zoom is off
    if (view !== 'map-properties' || !zoomEnabled) {
      setCanvasScale((previous) => ({ ...previous, active: false }));

      return;
    }

    const area = canvasAreaRef.current;

    if (!area) {
      return;
    }

    const canvas = area.querySelector('.design-canvas') as HTMLElement;

    if (!canvas) {
      return;
    }

    const areaRect = area.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    // Canvas size
    const canvasWidth = canvasRect.width;
    const canvasHeight = canvasRect.height;

    // Canvas center relative to the area
    const centerX = canvasRect.left - areaRect.left + canvasWidth / 2;
    const centerY = canvasRect.top - areaRect.top + canvasHeight / 2;

    // Workspace center
    const areaCenterX = areaRect.width / 2;
    const areaCenterY = areaRect.height / 2;

    // Max scale that fits when centered: the scaled canvas must
    // not exceed the area bounds in either dimension
    const maxScaleX = canvasWidth > 0 ? areaRect.width / canvasWidth : Infinity;
    const maxScaleY =
      canvasHeight > 0 ? areaRect.height / canvasHeight : Infinity;
    const scale = Math.max(1, Math.min(1.5, maxScaleX, maxScaleY));

    // Translate offset to move canvas center to workspace center.
    // Applied after the scale (which is anchored at the canvas center),
    // so a simple difference is sufficient.
    const translateX = areaCenterX - centerX;
    const translateY = areaCenterY - centerY;

    setCanvasScale({
      active: true,
      scale,
      originX: centerX,
      originY: centerY,
      translateX,
      translateY,
    });
  }, [view, zoomEnabled]);

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
    <div ref={browserRef} className="design-browser">
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

            {/* Toolbar for the mapping view */}
            {view === 'map-properties' && (
              <div className="design-browser-action-bar">
                <SwitchField
                  label="design-property-mapping.browser.zoom"
                  size="sm"
                  checked={zoomEnabled}
                  onCheckedChange={setZoomEnabled}
                />
                <span className="property-mapping-counter">
                  {t('design-property-mapping.browser.mappingCounter', {
                    mapped: mappedCount,
                    total: totalCount,
                  })}
                </span>
              </div>
            )}

            {/* Canvas area for the design preview */}
            <div
              ref={canvasAreaRef}
              className="design-browser-canvas-area"
              style={{
                transform: canvasScale.active
                  ? `translate(${canvasScale.translateX}px, ${canvasScale.translateY}px) scale(${canvasScale.scale})`
                  : 'translate(0, 0) scale(1)',
                transformOrigin: `${canvasScale.originX}px ${canvasScale.originY}px`,
              }}
            >
              <DesignCanvas
                designType={selectedDesign.type}
                className={
                  view === 'map-properties' ? 'hide-handles' : undefined
                }
              >
                <DesignRootElement element={selectedDesign.tree} />
                {view === 'map-properties' && draggingPropertyType && (
                  <PropertyMappingOverlay
                    tree={selectedDesign.tree}
                    onDrop={handlePropertyDrop}
                  />
                )}
              </DesignCanvas>
            </div>
          </>
        )}
      </div>

      {/* Connection line from hovered mapped property to its design element */}
      {view === 'map-properties' && (
        <PropertyConnectionLine containerRef={browserRef} />
      )}
    </div>
  );
};
