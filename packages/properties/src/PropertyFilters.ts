import {
  MULTISELECT_PROPERTY_FILTER_OPERATORS,
  PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
  VALUE_LESS_PROPERTY_FILTER_OPERATORS,
} from './constants';

export const constants = {
  OperatorsByPropertyType: PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
  MultiselectOperators: MULTISELECT_PROPERTY_FILTER_OPERATORS,
  ValueLessOperators: VALUE_LESS_PROPERTY_FILTER_OPERATORS,
};

export {
  applyPropertyFilters as apply,
  isCompletePropertyFilter as isComplete,
  isPropertyFilterDateValue as isDateValue,
  matchesPropertyFilter as matches,
  resolvePropertyFilterDateRange as resolveDateRange,
  resolvePropertyFilterOperators as resolveOperators,
} from './utils';
