import { ElementTypeConfig } from './types';

let configs: ElementTypeConfig[] = [];

function add(config: ElementTypeConfig): void {
  configs.push(config);
}

function remove(type: string): void {
  const index = configs.findIndex((config) => config.type === type);

  if (index !== -1) {
    configs.splice(index, 1);
  }
}

function get(type: string): ElementTypeConfig | undefined {
  return configs.find((config) => config.type === type);
}

function getAll(): ElementTypeConfig[] {
  return configs;
}

function clear(): void {
  configs = [];
}

export const ElementTypeConfigsStore = {
  add,
  remove,
  get,
  getAll,
  clear,
};
