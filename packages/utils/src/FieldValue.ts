export interface FieldValueArrayUnion<T = any> {
  isFieldValue: true;
  type: 'array-union';
  elements: T | T[];
}

export interface FieldValueArrayRemove<T = any> {
  isFieldValue: true;
  type: 'array-remove';
  elements: T | T[];
}

export interface FieldValueArrayFilter<T = any> {
  isFieldValue: true;
  type: 'array-filter';
  callback(item: T): boolean;
}

export interface FieldValueObjectUnion {
  isFieldValue: true;
  type: 'object-union';
  value: object;
}

export interface FieldValueDelete {
  isFieldValue: true;
  type: 'delete';
}

export type FieldValue =
  | FieldValueArrayUnion
  | FieldValueArrayRemove
  | FieldValueArrayFilter
  | FieldValueObjectUnion
  | FieldValueDelete;

function arrayUnion<T = any>(elements: T | T[]): FieldValueArrayUnion<T> {
  return {
    isFieldValue: true,
    type: 'array-union',
    elements,
  };
}

function arrayRemove<T = any>(elements: T | T[]): FieldValueArrayRemove<T> {
  return {
    isFieldValue: true,
    type: 'array-remove',
    elements,
  };
}

function arrayFilter<T = any>(
  callback: (item: T) => boolean,
): FieldValueArrayFilter<T> {
  return {
    isFieldValue: true,
    type: 'array-filter',
    callback,
  };
}

function objectUnion(value: object): FieldValueObjectUnion {
  return {
    isFieldValue: true,
    type: 'object-union',
    value,
  };
}

export const FieldValue = {
  arrayUnion,
  arrayRemove,
  arrayFilter,
  objectUnion,
  delete: (): FieldValueDelete => ({
    isFieldValue: true,
    type: 'delete',
  }),
};
