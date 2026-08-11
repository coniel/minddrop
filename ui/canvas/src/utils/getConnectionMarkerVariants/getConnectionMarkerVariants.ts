import { ContentColor } from '@minddrop/ui-theme';
import {
  CanvasConnection,
  CanvasConnectionStyleDefaults,
  CanvasConnectionThickness,
} from '../../types';
import { resolveConnectionStyle } from '../resolveConnectionStyle';

/**
 * An arrowhead marker's color and size combination.
 */
export interface CanvasConnectionMarkerVariant {
  /**
   * The arrowhead's fill color.
   */
  color: ContentColor;

  /**
   * The thickness the arrowhead is sized for.
   */
  thickness: CanvasConnectionThickness;
}

export interface GetConnectionMarkerVariantsOptions {
  /**
   * Style values applied to connections which do not set their
   * own.
   */
  connectionDefaults?: CanvasConnectionStyleDefaults;

  /**
   * Style overrides for the drag preview curve.
   */
  previewStyle?: CanvasConnectionStyleDefaults;

  /**
   * The ID of the connection highlighted as a drop target, which
   * is drawn thicker than it is styled.
   */
  dropTargetConnectionId?: string | null;
}

/**
 * Returns the color and thickness combinations arrowhead markers
 * are needed for: one per combination in use by the connections,
 * plus the drag preview's, which is always defined.
 *
 * @param connections - The rendered connections.
 * @param options - The style defaults and drop target.
 * @returns The marker variants, without duplicates.
 */
export function getConnectionMarkerVariants(
  connections: CanvasConnection[],
  options: GetConnectionMarkerVariantsOptions = {},
): CanvasConnectionMarkerVariant[] {
  const { connectionDefaults, previewStyle, dropTargetConnectionId } = options;

  // Keyed by combination, so a combination shared by several
  // connections defines a single marker
  const variants = new Map<string, CanvasConnectionMarkerVariant>();

  // The preview curve's combination when no re-connect styling
  // applies
  const preview = resolveConnectionStyle([previewStyle, connectionDefaults]);

  variants.set(`${preview.color}-${preview.thickness}`, {
    color: preview.color,
    thickness: preview.thickness,
  });

  connections.forEach((connection) => {
    const { color, thickness } = resolveConnectionStyle([
      connection,
      connectionDefaults,
    ]);

    // Drop targets are drawn thicker than they are styled
    const markerThickness =
      connection.id === dropTargetConnectionId ? 'thick' : thickness;

    variants.set(`${color}-${markerThickness}`, {
      color,
      thickness: markerThickness,
    });
  });

  return Array.from(variants.values());
}
