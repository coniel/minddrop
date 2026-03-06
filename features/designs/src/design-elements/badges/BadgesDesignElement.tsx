import { CSSProperties } from 'react';
import { BadgesElement, BadgesElementStyle } from '@minddrop/designs';
import { SelectPropertySchema } from '@minddrop/properties';
import { ContentColor, ContentColors } from '@minddrop/ui-theme';
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
 * Renders select property values as styled span elements,
 * falling back to placeholder badges when no property is mapped.
 */
export const BadgesDesignElement: React.FC<BadgesDesignElementProps> = ({
  element,
}) => {
  const property = useElementProperty(element.id);

  // Build the wrapper style (margins, text-align)
  const wrapperStyle = createWrapperStyle(element.style);

  // Build the base badge item style (typography, padding, radius)
  const baseItemStyle = createBadgeItemStyle(element.style);

  // When a property is mapped, render its select values as badges
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

          const itemStyle = {
            ...baseItemStyle,
            ...getBadgeColorStyle(option?.color),
          };

          return (
            <span key={value} style={itemStyle}>
              {value}
            </span>
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
      {placeholderLabels.map((label, index) => {
        const color =
          colourPalette[(colourOffset + index) % colourPalette.length];

        const itemStyle = {
          ...baseItemStyle,
          ...getBadgeColorStyle(color),
        };

        return (
          <span key={`${label}-${index}`} style={itemStyle}>
            {label}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Builds the wrapper div style from the badges element style.
 * Applies margins and text alignment.
 */
function createWrapperStyle(style: BadgesElementStyle): CSSProperties {
  return {
    marginTop: style['margin-top'] ? `${style['margin-top']}rem` : undefined,
    marginRight: style['margin-right']
      ? `${style['margin-right']}rem`
      : undefined,
    marginBottom: style['margin-bottom']
      ? `${style['margin-bottom']}rem`
      : undefined,
    marginLeft: style['margin-left'] ? `${style['margin-left']}rem` : undefined,
  };
}

/**
 * Builds the inline style for individual badge items from the
 * element's typography, padding, and border radius properties.
 */
function createBadgeItemStyle(style: BadgesElementStyle): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    fontFamily:
      style['font-family'] === 'inherit'
        ? 'inherit'
        : `var(--font-${style['font-family']})`,
    fontWeight: style['font-weight'],
    fontSize: `${style['font-size']}rem`,
    letterSpacing: `${style['letter-spacing']}em`,
    fontStyle: style.italic ? 'italic' : 'normal',
    textDecoration: style.underline ? 'underline' : 'none',
    textTransform: style['text-transform'],
    opacity: style.opacity,
    paddingTop: style.paddingTop ? `${style.paddingTop}rem` : undefined,
    paddingRight: style.paddingRight ? `${style.paddingRight}rem` : undefined,
    paddingBottom: style.paddingBottom
      ? `${style.paddingBottom}rem`
      : undefined,
    paddingLeft: style.paddingLeft ? `${style.paddingLeft}rem` : undefined,
    borderStyle: style.borderStyle,
    borderWidth: `${style.borderWidth}px`,
    borderColor: 'currentColor',
    borderRadius: style.round
      ? '9999px'
      : `${style.borderRadiusTopLeft}px ${style.borderRadiusTopRight}px ${style.borderRadiusBottomRight}px ${style.borderRadiusBottomLeft}px`,
  };
}

/**
 * Returns background and text color CSS for a badge based on
 * its content color. Falls back to neutral styling when no
 * color is provided.
 */
function getBadgeColorStyle(color?: ContentColor): CSSProperties {
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
