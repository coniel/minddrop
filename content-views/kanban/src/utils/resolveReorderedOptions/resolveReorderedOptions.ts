import { SelectPropertyOption } from '@minddrop/properties';

/**
 * Resolves a property's options reordered to match the given
 * value order. Options not listed in the order (e.g. hidden
 * columns) keep their original positions.
 *
 * @param options - The property's current options.
 * @param orderedValues - The values of the reordered options, in their new order.
 * @returns The reordered options.
 */
export function resolveReorderedOptions(
  options: SelectPropertyOption[],
  orderedValues: string[],
): SelectPropertyOption[] {
  // Queue the reordered options in their new relative order,
  // dropping values which no longer name an option.
  const reordered = orderedValues
    .map((value) => options.find((option) => option.value === value))
    .filter((option) => option !== undefined);

  // Fill the reordered options into the positions the listed
  // options occupied, leaving unlisted ones in place.
  return options.map((option) =>
    orderedValues.includes(option.value) ? reordered.shift()! : option,
  );
}
