import { useTranslation } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
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
 * the rendered design's schemas: the studio design's properties
 * in the studio, the schemas provider otherwise. Entry rendering
 * always resolves against the schemas provider so entries inside
 * the studio (e.g. view elements) use their own design.
 */
function useBoundDesignProperty(
  element: Pick<PlaceholderElement, 'property'>,
): {
  property: PropertySchema | null;
  isEntryContext: boolean;
} {
  // Present only when rendering real entries
  const entryContext = useDesignProperties();
  const studioProperties = useDesignStudioStore(
    (state) => state.design?.properties,
  );
  const schemaProperties = useDesignPropertySchemas();

  const properties = entryContext
    ? schemaProperties || []
    : studioProperties || schemaProperties || [];

  const property = element.property
    ? properties.find((candidate) => candidate.name === element.property) ||
      null
    : null;

  return { property, isEntryContext: !!entryContext };
}
