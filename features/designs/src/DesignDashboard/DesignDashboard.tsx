import { useCallback, useEffect, useRef, useState } from 'react';
import { Design, Designs, Layout } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import {
  Button,
  Group,
  IconButton,
  ScrollArea,
  Spacer,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { DesignPreviewProvider, DesignRootElement } from '../DesignElements';
import { DesignStudioStore } from '../DesignStudioStore';
import { resetView } from '../viewportActions';
import './DesignDashboard.css';

// Fallback preview height for layouts without a fixed frame
// height or root min-height
const PREVIEW_FALLBACK_HEIGHT = 200;

// Fraction of the preview area the fitted design may occupy
const PREVIEW_FILL = 0.85;

export interface DesignDashboardProps {
  /**
   * Callback fired when the back button is clicked.
   */
  onClickBack?: () => void;
}

/**
 * Renders the design studio's home view: a grid of design cards
 * from which a design can be opened in the editor, plus a new
 * design action.
 */
export const DesignDashboard: React.FC<DesignDashboardProps> = ({
  onClickBack,
}) => {
  const designs = Designs.useAll();

  // Create a new empty design and open it in the editor
  const handleCreateDesign = useCallback(async () => {
    const design = await Designs.create();

    DesignStudioStore.getState().initialize(design);
  }, []);

  // Open the design in the editor with all of its layouts
  // fitted into view
  const handleOpenDesign = useCallback((design: Design) => {
    DesignStudioStore.getState().initialize(design);
    resetView();
  }, []);

  return (
    <div className="design-dashboard">
      <Group gap={2} className="design-dashboard-header">
        {onClickBack && (
          <IconButton
            icon="arrow-left"
            label="designStudio.exit"
            tooltip={{ title: 'designStudio.exit' }}
            color="neutral"
            onClick={onClickBack}
          />
        )}
        <Text size="lg" weight="semibold" text="design-studio.labels.designs" />
        <Spacer />
        <Button
          label="designs.new"
          variant="solid"
          color="primary"
          onClick={handleCreateDesign}
        />
      </Group>
      <ScrollArea>
        <div className="design-dashboard-content">
          {designs.length === 0 && (
            <Text block color="muted" text="design-studio.dashboard.empty" />
          )}
          <div className="design-dashboard-grid">
            {designs.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                onClick={handleOpenDesign}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

interface DesignCardProps {
  /**
   * The design the card represents.
   */
  design: Design;

  /**
   * Callback fired with the design when the card is clicked.
   */
  onClick: (design: Design) => void;
}

/**
 * Renders a design as a clickable card with a scaled-down live
 * preview, the design name and layout count + last modified
 * metadata.
 */
const DesignCard: React.FC<DesignCardProps> = ({ design, onClick }) => {
  const { t } = useTranslation();

  const layoutCountKey =
    design.layouts.length === 1
      ? 'design-studio.dashboard.layoutCount_one'
      : 'design-studio.dashboard.layoutCount_other';

  const handleClick = useCallback(() => {
    onClick(design);
  }, [onClick, design]);

  return (
    <button
      type="button"
      className="design-dashboard-card"
      onClick={handleClick}
    >
      <DesignCardPreview design={design} />
      <Stack gap={1} className="design-dashboard-card-details">
        <Text size="sm" weight="medium" truncate>
          {design.name}
        </Text>
        <Text size="xs" color="muted">
          {t(layoutCountKey, { count: design.layouts.length })} ·{' '}
          {design.lastModified.toLocaleDateString()}
        </Text>
      </Stack>
    </button>
  );
};

interface DesignCardPreviewProps {
  /**
   * The design to preview.
   */
  design: Design;
}

/**
 * Renders a scaled-down live preview of the design's layouts at
 * their canvas positions, fitted into the card's preview area.
 */
const DesignCardPreview: React.FC<DesignCardPreviewProps> = ({ design }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const bounds = getDesignBounds(design.layouts);

  // Track the preview area size so the design can be fitted to it
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      setContainerSize({ width, height });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Scale that fits the design bounds into the preview area
  const scale =
    bounds && containerSize.width
      ? Math.min(
          (containerSize.width * PREVIEW_FILL) / bounds.width,
          (containerSize.height * PREVIEW_FILL) / bounds.height,
        )
      : 0;

  return (
    <div ref={containerRef} className="design-dashboard-card-preview">
      {bounds && scale > 0 ? (
        <DesignPreviewProvider value>
          <div
            className="design-dashboard-card-preview-canvas"
            style={{
              width: bounds.width,
              height: bounds.height,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            {design.layouts.map((layout) => (
              <div
                key={layout.id}
                className="design-dashboard-card-preview-layout"
                style={{
                  left: layout.frame.x - bounds.x,
                  top: layout.frame.y - bounds.y,
                  width: layout.frame.width,
                  height: getLayoutPreviewHeight(layout),
                }}
              >
                <DesignRootElement element={layout.tree} />
              </div>
            ))}
          </div>
        </DesignPreviewProvider>
      ) : (
        <Text
          size="sm"
          color="muted"
          text="design-studio.dashboard.noLayouts"
        />
      )}
    </div>
  );
};

/**
 * Returns the height a layout occupies in the preview: its fixed
 * frame height, or the root element's min-height for content-sized
 * layouts.
 */
function getLayoutPreviewHeight(layout: Layout): number {
  return (
    layout.frame.height ??
    layout.tree.style.minHeight ??
    PREVIEW_FALLBACK_HEIGHT
  );
}

/**
 * Computes the union bounding box of the layouts' frames in canvas
 * coordinates. Returns null when the design has no layouts.
 */
function getDesignBounds(
  layouts: Layout[],
): { x: number; y: number; width: number; height: number } | null {
  if (!layouts.length) {
    return null;
  }

  const minX = Math.min(...layouts.map((layout) => layout.frame.x));
  const minY = Math.min(...layouts.map((layout) => layout.frame.y));
  const maxX = Math.max(
    ...layouts.map((layout) => layout.frame.x + layout.frame.width),
  );
  const maxY = Math.max(
    ...layouts.map((layout) => layout.frame.y + getLayoutPreviewHeight(layout)),
  );

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
