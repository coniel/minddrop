import { useContext } from 'react';
import { SubviewDescriptor } from '../types';
import { SubviewContext } from './SubviewContext';

/**
 * Returns the entity currently shown within the view instance the
 * calling component is rendered in. Null when the view shows none.
 */
export function useSubview(): SubviewDescriptor | null {
  return useContext(SubviewContext);
}
