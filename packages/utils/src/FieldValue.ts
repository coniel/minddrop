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

export interface FieldValueDelete {
  isFieldValue: true;
  type: 'delete';
}

export type FieldValue =
  | FieldValueArrayUnion
  | FieldValueArrayRemove
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

export const FieldValue = {
  arrayUnion,
  arrayRemove,
  delete: (): FieldValueDelete => ({
    isFieldValue: true,
    type: 'delete',
  }),
};