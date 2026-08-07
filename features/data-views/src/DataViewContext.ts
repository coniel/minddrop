import { createContext, useContext } from 'react';

/**
 * Context describing the data view in which its content is
 * rendered. Content rendered outside a data view receives the
 * default values.
 */
export interface DataViewContextValue {
  /**
   * Whether entries rendered within the data view can be dragged,
   * set from the view type's `draggableEntries` flag.
   */
  draggableEntries: boolean;
}

export const DataViewContext = createContext<DataViewContextValue>({
  draggableEntries: false,
});

export const useDataViewContext = () => useContext(DataViewContext);
