import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Design,
  Designs,
  Layout,
  resolveDesignMediaDirPath,
} from '@minddrop/designs';
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
import { DesignPropertySchemasProvider } from '../DesignPropertiesProvider';
import { DesignStudioStore } from '../DesignStudioStore';
import { MediaDirProvider } from '../MediaDirContext';
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

    DesignStudioStore.initialize(design);
  }, []);

  // Open the design in the editor. The studio workspace fits the
  // design's layouts into view when it mounts.
  const handleOpenDesign = useCallback((design: Design) => {
    DesignStudioStore.initialize(design);
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [layoutHeights, setLayoutHeights] = useState<Record<string, number>>(
    {},
  );

  // Design bounds using the layouts' measured heights, falling
  // back to estimates until they have been measured
  const bounds = getDesignBounds(design.layouts, layoutHeights);

  // Scale that fits the whole design into the preview area
  const scale = getPreviewScale(bounds, containerSize);

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

  // Measure each layout's rendered height so the fitted scale
  // reflects the real content rather than an estimate
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const measure = () => {
      const heights: Record<string, number> = {};

      canvas
        .querySelectorAll<HTMLElement>('[data-layout-id]')
        .forEach((element) => {
          heights[element.dataset.layoutId as string] = element.offsetHeight;
        });

      setLayoutHeights((previous) =>
        areLayoutHeightsEqual(previous, heights) ? previous : heights,
      );
    };

    const observer = new ResizeObserver(measure);

    canvas
      .querySelectorAll<HTMLElement>('[data-layout-id]')
      .forEach((element) => observer.observe(element));

    measure();

    return () => {
      observer.disconnect();
    };
  }, [design]);

  return (
    <div ref={containerRef} className="design-dashboard-card-preview">
      {bounds ? (
        <DesignPreviewProvider value>
          <DesignPropertySchemasProvider properties={design.properties}>
            <MediaDirProvider value={resolveDesignMediaDirPath(design.id)}>
              <div
                ref={canvasRef}
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
                    data-layout-id={layout.id}
                    className="design-dashboard-card-preview-layout"
                    style={{
                      left: layout.frame.x - bounds.x,
                      top: layout.frame.y - bounds.y,
                      width: layout.frame.width,
                    }}
                  >
                    <DesignRootElement element={layout.tree} />
                  </div>
                ))}
              </div>
            </MediaDirProvider>
          </DesignPropertySchemasProvider>
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
 * Computes the scale that fits the design bounds within the
 * preview area, leaving a margin defined by PREVIEW_FILL. Returns
 * 0 until both the bounds and the preview area have a size.
 */
function getPreviewScale(
  bounds: { width: number; height: number } | null,
  containerSize: { width: number; height: number },
): number {
  if (
    !bounds ||
    bounds.width <= 0 ||
    bounds.height <= 0 ||
    !containerSize.width ||
    !containerSize.height
  ) {
    return 0;
  }

  return Math.min(
    (containerSize.width * PREVIEW_FILL) / bounds.width,
    (containerSize.height * PREVIEW_FILL) / bounds.height,
  );
}

/**
 * Computes the union bounding box of the layouts in canvas
 * coordinates. Returns null when the design has no layouts.
 */
function getDesignBounds(
  layouts: Layout[],
  layoutHeights: Record<string, number>,
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
    ...layouts.map(
      (layout) => layout.frame.y + getLayoutHeight(layout, layoutHeights),
    ),
  );

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/**
 * Returns a layout's measured height, falling back to an estimate
 * from its frame height or root min-height before it has been
 * measured.
 */
function getLayoutHeight(
  layout: Layout,
  layoutHeights: Record<string, number>,
): number {
  return (
    layoutHeights[layout.id] ??
    layout.frame.height ??
    layout.tree.style.minHeight ??
    PREVIEW_FALLBACK_HEIGHT
  );
}

/**
 * Shallow-compares two maps of layout heights.
 */
function areLayoutHeightsEqual(
  a: Record<string, number>,
  b: Record<string, number>,
): boolean {
  const keys = Object.keys(a);

  if (keys.length !== Object.keys(b).length) {
    return false;
  }

  return keys.every((key) => a[key] === b[key]);
}
