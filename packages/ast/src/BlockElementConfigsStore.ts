import { BlockElementConfig } from './types';

let configs: BlockElementConfig[] = [];

function add(config: BlockElementConfig): void {
  configs.push(config);
}

function remove(type: string): void {
  const index = configs.findIndex((config) => config.type === type);

  if (index !== -1) {
    configs.splice(index, 1);
  }
}

function get(type: string): BlockElementConfig | undefined {
  return configs.find((config) => config.type === type);
}

function getAll(): BlockElementConfig[] {
  return configs;
}

function clear(): void {
  configs = [];
}

export const BlockElementConfigsStore = {
  add,
  remove,
  get,
  getAll,
  clear,
};
