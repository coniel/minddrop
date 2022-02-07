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
  objectUnion,
  delete: (): FieldValueDelete => ({
    isFieldValue: true,
    type: 'delete',
  }),
};
