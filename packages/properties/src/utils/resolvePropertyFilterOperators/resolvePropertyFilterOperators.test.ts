import { describe, expect, it } from 'vitest';
import {
  MULTISELECT_PROPERTY_FILTER_OPERATORS,
  PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
} from '../../constants';
import { SelectPropertySchema } from '../../schemas';
import { resolvePropertyFilterOperators } from './resolvePropertyFilterOperators';

// A single choice select property
const selectProperty: SelectPropertySchema = {
  type: 'select',
  name: 'Status',
  options: [],
};

describe('resolvePropertyFilterOperators', () => {
  it("returns the property type's operators", () => {
    expect(resolvePropertyFilterOperators(selectProperty)).toBe(
      PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE.select,
    );
  });

  it('returns the multiselect operators for multiselect selects', () => {
    expect(
      resolvePropertyFilterOperators({ ...selectProperty, multiselect: true }),
    ).toBe(MULTISELECT_PROPERTY_FILTER_OPERATORS);
  });
});
