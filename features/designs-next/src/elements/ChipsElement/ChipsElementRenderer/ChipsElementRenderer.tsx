import { DesignElementProps } from '@minddrop/designs-next';
import { Tags } from '@minddrop/tags';
import {
  resolveCornerRadius,
  useElementProperty,
} from '@minddrop/ui-designs-next';
import { Chip, Group } from '@minddrop/ui-primitives';
import { PropertyChip, resolvePropertyChips } from '../../../utils';
import { ChipsElement } from '../ChipsElement.types';
import { DefaultChipCornerRadius, DefaultChipSize } from '../constants';
import './ChipsElementRenderer.css';

/**
 * Renders a chips element as one chip per value of the select or
 * tags property it maps to.
 */
export const ChipsElementRenderer: React.FC<
  DesignElementProps<ChipsElement>
> = ({ element }) => {
  // Read the property the element maps to
  const property = useElementProperty(element);
  // Read the tags
  const tags = Tags.useAll();

  // Resolve the mapped value's chips, none while unmapped
  const valueChips = property
    ? resolvePropertyChips(property.value, property.schema, tags)
    : [];

  // Fall back to the element's own content as one chip
  const chips =
    valueChips.length > 0 ? valueChips : resolveContentChips(element);

  // Resolve the chips' corner radius into the style it renders as
  const chipStyle = {
    borderRadius: resolveCornerRadius(
      element.cornerRadius ?? DefaultChipCornerRadius,
    ),
  };

  // Render the chips in a wrapping row
  return (
    <Group className="design-chips-element" gap={1} wrap>
      {chips.map((chip) => (
        <Chip
          key={chip.value}
          size={element.size ?? DefaultChipSize}
          color={chip.color}
          style={chipStyle}
        >
          {chip.value}
        </Chip>
      ))}
    </Group>
  );
};

/**
 * Resolves the chips an element's own content renders as: one chip,
 * or none without content.
 *
 * @param element - The chips element.
 * @returns The content chips.
 */
function resolveContentChips(element: ChipsElement): PropertyChip[] {
  if (!element.content) {
    return [];
  }

  // Resolve the content as one chip in the default colour
  return [{ value: element.content, color: 'default' }];
}
