import { getElementConfig, getPropertyElementConfig } from '@minddrop/designs';
import { useTranslation } from '@minddrop/i18n';
import { PropertySchema, PropertyType } from '@minddrop/properties';
import { useDesignPreview } from './DesignElements';
import {
  useDesignProperties,
  useDesignPropertySchemas,
} from './DesignPropertiesProvider';

interface PlaceholderElement {
  /**
   * The element type.
   */
  type: string;

  /**
   * The property type of a property element, which names its type
   * label.
   */
  propertyType?: PropertyType;

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
 * property value. Placeholders exist so a designer can judge the
 * look while designing, so a bound element resolves one only
 * outside of entry rendering, falling back to the bound property's
 * name or the element type label so elements never render empty in
 * the studio. Static elements resolve their own content, which is
 * real content rather than a placeholder.
 */
export function useElementPlaceholder(element: PlaceholderElement): string {
  const { t } = useTranslation();
  const { property, isEntryContext } = useBoundDesignProperty(element);

  // Rendering real entries: only static content is displayed. A
  // bound element's placeholder is a design aid and would read as
  // real content here.
  if (isEntryContext) {
    if (element.static) {
      return element.content || '';
    }

    return '';
  }

  // Studio/preview fallback ensuring elements never render empty.
  // Property elements are named after their property element
  // config, falling back to the element type when the property
  // type has none.
  const propertyElementConfig = element.propertyType
    ? getPropertyElementConfig(element.propertyType, false)
    : null;
  const typeLabel = t(
    propertyElementConfig?.label ?? getElementConfig(element.type).label,
  );

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
 * design property's placeholder otherwise. A bound element resolves
 * nothing during entry rendering, so a design's placeholder image
 * never appears in a rendered entry.
 */
export function useElementPlaceholderImage(
  element: Pick<PlaceholderElement, 'static' | 'property'>,
  elementImage?: string,
): string {
  const { property, isEntryContext } = useBoundDesignProperty(element);

  // Static elements display their own image
  if (element.static) {
    return elementImage || '';
  }

  // The property's placeholder is a design aid, not entry content
  if (isEntryContext) {
    return '';
  }

  return property?.placeholder || '';
}

/**
 * Resolves the placeholder icon for an element: the element's
 * own icon for static elements, the bound design property's
 * placeholder otherwise. A bound element resolves nothing during
 * entry rendering, so a design's placeholder icon never appears in
 * a rendered entry.
 */
export function useElementPlaceholderIcon(
  element: Pick<PlaceholderElement, 'static' | 'property'>,
  elementIcon?: string,
): string {
  const { property, isEntryContext } = useBoundDesignProperty(element);

  // Static elements display their own icon
  if (element.static) {
    return elementIcon || '';
  }

  // The property's placeholder is a design aid, not entry content
  if (isEntryContext) {
    return '';
  }

  return property?.placeholder || '';
}

/**
 * Resolves the design property an element is bound to against
 * the property schemas of the design being rendered. Studio hosts
 * provide the open design's schemas via DesignPropertySchemasProvider,
 * so each render scope resolves its own design's properties.
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
  const schemaProperties = useDesignPropertySchemas();

  // Present only when rendering real entries, never in previews
  const entryContext = isPreview ? null : designProperties;

  const properties = schemaProperties || [];

  const property = element.property
    ? properties.find((candidate) => candidate.name === element.property) ||
      null
    : null;

  return { property, isEntryContext: !!entryContext };
}
