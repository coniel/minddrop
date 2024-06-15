import { InlineElementConfig } from './types';

let configs: InlineElementConfig[] = [];

function add(config: InlineElementConfig): void {
  configs.push(config);
}

function remove(type: string): void {
  const index = configs.findIndex((config) => config.type === type);

  if (index !== -1) {
    configs.splice(index, 1);
  }
}

function get(type: string): InlineElementConfig | undefined {
  return configs.find((config) => config.type === type);
}

function getAll(): InlineElementConfig[] {
  return configs;
}

function clear(): void {
  configs = [];
}

export const InlineElementConfigsStore = {
  add,
  remove,
  get,
  getAll,
  clear,
};
