import { clear as clearAssetHandlers } from '../AssetHandlersStore';

export function setup() {}

export function cleanup() {
  clearAssetHandlers();
}
