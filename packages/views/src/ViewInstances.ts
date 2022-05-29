import { ViewInstancesApi } from './types';
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
