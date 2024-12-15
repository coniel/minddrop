/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditorBlockElementConfig } from './types';

const configs = new Map<string, EditorBlockElementConfig>();

function add(config: EditorBlockElementConfig<any>): void {
  configs.set(config.type, config);
}

function remove(type: string): void {
  configs.delete(type);
}

function get(type: string): EditorBlockElementConfig | undefined {
  return configs.get(type);
}

function getAll(): EditorBlockElementConfig[] {
  return Array.from(configs.values());
}

function clear(): void {
  configs.clear();
}

export const EditorBlockElementConfigsStore = {
  add,
  remove,
  get,
  getAll,
  clear,
};
