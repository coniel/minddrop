import { SelectionItemSerializersRegistry } from './SelectionItemSerializersRegistry';

export const {
  store: Store,
  register,
  unregister,
  get,
  getAll,
  use,
  useAll,
} = SelectionItemSerializersRegistry;
