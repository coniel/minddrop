/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditorInlineElementConfig } from './types';

const configs = new Map<string, EditorInlineElementConfig>();

function add(config: EditorInlineElementConfig<any>): void {
  configs.set(config.type, config);
}

function remove(type: string): void {
  configs.delete(type);
}

function get(type: string): EditorInlineElementConfig | undefined {
  return configs.get(type);
}

function getAll(): EditorInlineElementConfig[] {
  return Array.from(configs.values());
}

function clear(): void {
  configs.clear();
}

export const EditorInlineElementConfigsStore = {
  add,
  remove,
  get,
  getAll,
  clear,
};
