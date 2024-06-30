import { NodeClassifierConfigsStore } from '../NodeClassifierConfigsStore';
import { NodeRendererConfigsStore } from '../NodeRendererConfigsStore';

export function setup() {}

export function cleanup() {
  NodeClassifierConfigsStore.clear();
  NodeRendererConfigsStore.clear();
}
