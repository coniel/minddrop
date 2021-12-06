import { applyFieldValueDelete } from './applyFieldValueDelete';
import { applyFieldValueArrayUnion } from './applyFieldValueArrayUnion';
import { applyFieldValueArrayRemove } from './applyFieldValueArrayRemove';
import { mergeRegularValues } from './mergeRegularValues';

/**
 * Updates field values by applying FieldValue mutations
 * and merging in regular fields.
 *
 * @param object The original field values.
 * @param changes The changes to apply.
 * @returns Updated field values.
 */
export function applyFieldValues<O extends object, C extends object>(
  object: O,
  changes: C,
): O {
  let applied = mergeRegularValues<O, C>(object, changes);
  applied = applyFieldValueDelete<O, C>(applied, changes);
  applied = applyFieldValueArrayUnion<O, C>(applied, changes);
  applied = applyFieldValueArrayRemove<O, C>(applied, changes);

  return applied;
}
