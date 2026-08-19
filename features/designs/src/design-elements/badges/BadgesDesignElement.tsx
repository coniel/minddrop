import { CSSProperties } from 'react';
import { BadgesElement } from '@minddrop/designs';
import { SelectPropertySchema } from '@minddrop/properties';
import { ContentColor, ContentColors } from '@minddrop/ui-theme';
import { useElementProperty } from '../../DesignPropertiesProvider';
import { useElementPlaceholder } from '../../useElementPlaceholder';
import './BadgesDesignElement.css';
import { useElementCssStyle } from '../../useElementCssStyle';

export interface BadgesDesignElementProps {
  /**
   * The badges element to render.
   */
  element: BadgesElement;
}

/**
 * Display renderer for a badges design element.
 * Renders select property values as styled span elements,
 * falling back to placeholder badges when no property is mapped.
 */
export const BadgesDesignElement: React.FC<BadgesDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);
  const placeholder = useElementPlaceholder(element);

  // Split the element CSS: margins go on the wrapper, the rest
  // styles the individual badge items
  const { marginTop, marginRight, marginBottom, marginLeft, ...baseItemCss } =
    useElementCssStyle(element);
  const wrapperCss = { marginTop, marginRight, marginBottom, marginLeft };

  // When a property is mapped, render its select values as badges
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
            ...createBadgeColorCss(option?.color),
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
  const placeholderLabels = parsePlaceholder(placeholder);

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
          ...createBadgeColorCss(color),
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
 * Returns background and text color CSS for a badge based on its
 * content color, following the Chip primitive's colour convention.
 * Falls back to neutral styling when no colour is provided.
 */
function createBadgeColorCss(color?: ContentColor): CSSProperties {
  if (!color || color === 'default') {
    return {
      backgroundColor: 'var(--neutral-300)',
      color: 'var(--text-muted)',
    };
  }

  return {
    backgroundColor: `var(--${color}-400)`,
    color: `var(--${color}-1100)`,
  };
}

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
