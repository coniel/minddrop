import { SelectPropertyElement } from '@minddrop/designs';
import { SelectPropertySchema } from '@minddrop/properties';
import { ContentColors } from '@minddrop/ui-theme';
import { useElementProperty } from '../../../DesignPropertiesProvider';
import { useElementCssStyle } from '../../../useElementCssStyle';
import { useElementPlaceholder } from '../../../useElementPlaceholder';
import { parseBadgeLabels, resolveBadgeColorCss } from '../../../utils';
import './BadgesPropertyRenderer.css';

export interface BadgesPropertyRendererProps {
  /**
   * The select property element to render.
   */
  element: SelectPropertyElement;
}

/**
 * Display renderer for a select property element rendered as
 * badges. Renders the selected option values as chips coloured by
 * the option's own colour, falling back to placeholder badges when
 * no property is bound.
 */
export const BadgesPropertyRenderer: React.FC<BadgesPropertyRendererProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Split the element CSS: margins go on the wrapper, the rest
  // styles the individual badge items
  const { marginTop, marginRight, marginBottom, marginLeft, ...baseItemCss } =
    useElementCssStyle(element);
  const wrapperCss = { marginTop, marginRight, marginBottom, marginLeft };

  // When a property is bound, render its select values as badges
  if (property?.value != null) {
    const schema = property.schema as SelectPropertySchema;

    // Normalise to an array (handles both single and multi-select)
    const values = Array.isArray(property.value)
      ? (property.value as string[])
      : [String(property.value)];

    return (
      <div className="designs-badges-element" style={wrapperCss}>
        {values.map((value) => {
          // Look up the option colour from the schema
          const option = schema.options?.find(
            (option) => option.value === value,
          );

          // The option colour applies over the element's own tokens
          const itemCss = {
            ...baseItemCss,
            ...resolveBadgeColorCss(option?.color),
          };

          return (
            <span key={value} className="designs-badge" style={itemCss}>
              {value}
            </span>
          );
        })}
      </div>
    );
  }

  // Placeholder fallback - split comma-separated string into badges
  const placeholderLabels = parseBadgeLabels(placeholder);

  if (placeholderLabels.length === 0) {
    return <div className="designs-badges-element" style={wrapperCss} />;
  }

  // Non-default content colours for deterministic placeholder colouring.
  // Derive a starting offset from the element ID so each badges element
  // gets a different colour sequence.
  const colourPalette = ContentColors.filter((color) => color !== 'default');
  const colourOffset = hashStringToIndex(element.id, colourPalette.length);

  return (
    <div className="designs-badges-element" style={wrapperCss}>
      {placeholderLabels.map((label, index) => {
        const color =
          colourPalette[(colourOffset + index) % colourPalette.length];

        // The placeholder colour applies over the element's own tokens
        const itemCss = {
          ...baseItemCss,
          ...resolveBadgeColorCss(color),
        };

        return (
          <span
            key={`${label}-${index}`}
            className="designs-badge"
            style={itemCss}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Hashes a string into an index within the given range using
 * a simple character-code sum. Used to derive a starting colour
 * offset from an element ID so that different badges elements
 * don't all follow the same colour sequence.
 */
function hashStringToIndex(value: string, range: number): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash + value.charCodeAt(i)) % range;
  }

  return hash;
}
