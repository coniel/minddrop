import { DesignElementProps } from '@minddrop/designs-next';
import { useElementProperty } from '@minddrop/ui-designs-next';
import { formatNumber, toNumber } from '@minddrop/utils';
import { TextElementRenderer } from '../../TextElement';
import { NumberElement } from '../NumberElement.types';
import { SampleNumber } from '../constants';

/**
 * Renders a number element as the number property it maps to,
 * written in the element's format.
 */
export const NumberElementRenderer: React.FC<
  DesignElementProps<NumberElement>
> = ({ element }) => {
  // Read the property the element maps to
  const property = useElementProperty(element);

  // Resolve the number to format, the sample while unmapped
  const value = property ? toNumber(property.value) : SampleNumber;

  // Format the number in the element's format between its prefix
  // and suffix, empty without a number.
  const text =
    value === undefined
      ? ''
      : [
          element.prefix,
          formatNumber(value, {
            decimals: element.decimals,
            separator: element.separator,
            signDisplay: element.signDisplay,
            notation: element.notation,
          }),
          element.suffix,
        ].join('');

  // Render the number as one line of text
  return <TextElementRenderer element={element} text={text} truncate />;
};
