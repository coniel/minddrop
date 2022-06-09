import { ViewInstancesApi, ViewInstanceTypeData } from './types';
import { ViewInstancesResource } from './ViewInstancesResource';

export const ViewInstances: ViewInstancesApi = {
  get: ViewInstancesResource.get,
  getAll: ViewInstancesResource.getAll,
  create: ViewInstancesResource.create,
  update: ViewInstancesResource.update,
  delete: ViewInstancesResource.delete,
  restore: ViewInstancesResource.restore,
  deletePermanently: ViewInstancesResource.deletePermanently,
  store: ViewInstancesResource.store,
  addEventListener: (core, event, callback) =>
    core.addEventListener(event, callback),
  removeEventListener: (core, event, callback) =>
    core.removeEventListener(event, callback),
};

/**
 * Returns a view instance by ID.
 *
 * @param viewInstanceId - The ID of the view instance.
 * @returns A view instance or `null` if it does not exist.
 */
export const useViewInstance = <TData extends ViewInstanceTypeData = {}>(
  viewInstanceId: string,
) => ViewInstancesResource.hooks.useDocument<TData>(viewInstanceId);
