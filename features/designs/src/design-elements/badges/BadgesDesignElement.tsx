import { BadgesElement, createTextCssStyle } from '@minddrop/designs';
import { SelectPropertySchema } from '@minddrop/properties';
import { Chip, ChipSize, ChipVariant } from '@minddrop/ui-primitives';
import { ContentColors } from '@minddrop/ui-theme';
import { useElementProperty } from '../../DesignPropertiesProvider';
import './BadgesDesignElement.css';

export interface BadgesDesignElementProps {
  /**
   * The badges element to render.
   */
  element: BadgesElement;
}

/**
 * Display renderer for a badges design element.
 * Renders select property values as colored Chip components,
 * falling back to placeholder badges when no property is mapped.
 */
export const BadgesDesignElement: React.FC<BadgesDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);

  // Resolve variant and size with defaults
  const variant: ChipVariant = element.variant ?? 'rectangular';
  const size: ChipSize = element.size ?? 'md';

  // Build the wrapper style from the text style config
  const wrapperStyle = createTextCssStyle(element.style);

  // When a property is mapped, render its select values as chips
  if (property?.value != null) {
    const schema = property.schema as SelectPropertySchema;

    // Normalise to an array (handles both single and multi-select)
    const values = Array.isArray(property.value)
      ? (property.value as string[])
      : [String(property.value)];

    return (
      <div className="badges-element-container" style={wrapperStyle}>
        {values.map((value) => {
          // Look up the option colour from the schema
          const option = schema.options?.find(
            (option) => option.value === value,
          );

          return (
            <Chip
              key={value}
              variant={variant}
              size={size}
              color={option?.color}
            >
              {value}
            </Chip>
          );
        })}
      </div>
    );
  }

  // Placeholder fallback - split comma-separated string into badges
  const placeholderLabels = parsePlaceholder(element.placeholder);

  if (placeholderLabels.length === 0) {
    return <div className="badges-element-container" style={wrapperStyle} />;
  }

  // Non-default content colours for deterministic placeholder colouring.
  // Derive a starting offset from the element ID so each badges element
  // gets a different colour sequence.
  const colourPalette = ContentColors.filter((color) => color !== 'default');
  const colourOffset = hashStringToIndex(element.id, colourPalette.length);

  return (
    <div className="badges-element-container" style={wrapperStyle}>
      {placeholderLabels.map((label, index) => (
        <Chip
          key={`${label}-${index}`}
          variant={variant}
          size={size}
          color={colourPalette[(colourOffset + index) % colourPalette.length]}
        >
          {label}
        </Chip>
      ))}
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

/**
 * Splits a comma-separated placeholder string into trimmed labels,
 * filtering out empty segments.
 */
function parsePlaceholder(placeholder?: string): string[] {
  if (!placeholder) {
    return [];
  }

  return placeholder
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);
}
