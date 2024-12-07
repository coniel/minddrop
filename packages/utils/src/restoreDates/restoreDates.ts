import { isSerializedDate } from '../isSerializedDate';

export function restoreDates<T = any>(object: Object): T {
  return deserialize(object);
}

// Helper function to recursively check and deserialize date strings
const deserialize = (value: any): any => {
  // If the value is an object, recursively process its keys
  if (value && typeof value === 'object') {
    // If it's an array, process each element
    if (Array.isArray(value)) {
      return value.map(deserialize);
    }

    // If it's an object, recursively process each key
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = deserialize(value[key]);

      return acc;
    }, {} as any);
  }

  // Check if it represents a date
  if (isSerializedDate(value)) {
    return new Date(value);
  }

  // Otherwise, return the value as is
  return value;
};
