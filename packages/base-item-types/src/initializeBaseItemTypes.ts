import { BaseItemTypeConfigsStore } from './BaseItemTypeConfigsStore';
import * as BaseItemsConfigsObject from './configs';

export function initializeBaseItemTypes() {
  BaseItemTypeConfigsStore.load(Object.values(BaseItemsConfigsObject));
}
