import { useTranslation } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import { useDesignPreview } from './DesignElements';
import {
  useDesignProperties,
  useDesignPropertySchemas,
} from './DesignPropertiesProvider';
import { useDesignStudioStore } from './DesignStudioStore';
import { elementLabelMap } from './constants';

interface PlaceholderElement {
  /**
   * The element type.
   */
  type: string;

  /**
   * Whether the element displays static content.
   */
  static?: boolean;

  /**
   * The name of the design property the element is bound to.
   */
  property?: string;

  /**
   * Static content displayed when the element is static.
   */
  content?: string;
}

/**
 * Resolves the fallback text an element displays when it has no
 * property value: static content for static elements, the bound
 * design property's placeholder otherwise. Outside of entry
 * rendering, additionally falls back to the bound property's
 * name, or the element type label, so elements never render
 * empty in the studio.
 */
export function useElementPlaceholder(element: PlaceholderElement): string {
  const { t } = useTranslation();
  const { property, isEntryContext } = useBoundDesignProperty(element);

  // Rendering real entries: static content or the bound property's
  // placeholder, with nothing displayed when unset
  if (isEntryContext) {
    if (element.static) {
      return element.content || '';
    }

    return property?.placeholder || '';
  }

  // Studio/preview fallback ensuring elements never render empty
  const label = elementLabelMap[element.type];
  const typeLabel = label ? t(label) : element.type;

  // Static elements display their own content
  if (element.static) {
    return element.content || typeLabel;
  }

  // Bound: property placeholder, falling back to the property name
  if (element.property) {
    return property?.placeholder || element.property;
  }

  return typeLabel;
}

/**
 * Resolves the placeholder image file name for an element: the
 * element's own image file name for static elements, the bound
 * design property's placeholder otherwise.
 */
export function useElementPlaceholderImage(
  element: Pick<PlaceholderElement, 'static' | 'property'>,
  elementImage?: string,
): string {
  const { property } = useBoundDesignProperty(element);

  // Static elements display their own image
  if (element.static) {
    return elementImage || '';
  }

  return property?.placeholder || '';
}

/**
 * Resolves the placeholder icon for an element: the element's
 * own icon for static elements, the bound design property's
 * placeholder otherwise.
 */
export function useElementPlaceholderIcon(
  element: Pick<PlaceholderElement, 'static' | 'property'>,
  elementIcon?: string,
): string {
  const { property } = useBoundDesignProperty(element);

  // Static elements display their own icon
  if (element.static) {
    return elementIcon || '';
  }

  return property?.placeholder || '';
}

/**
 * Resolves the design property an element is bound to against
 * the rendered design's schemas: the schemas provider when present
 * (entry rendering, dashboard previews), falling back to the studio
 * design's properties in the studio. Preferring the schemas provider
 * lets each preview resolve its own design rather than whichever
 * design happens to be open in the studio.
 */
function useBoundDesignProperty(
  element: Pick<PlaceholderElement, 'property'>,
): {
  property: PropertySchema | null;
  isEntryContext: boolean;
} {
  // Previews render the design template, not a real entry, even
  // when nested in an ambient entry context
  const isPreview = useDesignPreview();
  const designProperties = useDesignProperties();
  const studioProperties = useDesignStudioStore(
    (state) => state.design?.properties,
  );
  const schemaProperties = useDesignPropertySchemas();

  // Present only when rendering real entries, never in previews
  const entryContext = isPreview ? null : designProperties;

  const properties = entryContext
    ? schemaProperties || []
    : schemaProperties || studioProperties || [];

  const property = element.property
    ? properties.find((candidate) => candidate.name === element.property) ||
      null
    : null;

  return { property, isEntryContext: !!entryContext };
}
