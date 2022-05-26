import { TRDTypeData, TypedResourceDocument } from '@minddrop/resources';

export interface BaseViewInstanceData {
  /**
   * The ID of the registered view rendered by this view instance.
   */
  view: string;
}

export interface BaseCreateViewInstanceData {
  /**
   * The ID of the view rendered by the view instance.
   */
  view: string;
}

export interface BaseUpdateViewInstanceData {
  /**
   * The ID of the view rendered by the view instance.
   */
  view?: string;
}

export type ViewInstanceTypeData = TRDTypeData<BaseViewInstanceData>;

export type ViewInstance<TTypeData extends ViewInstanceTypeData = {}> =
  TypedResourceDocument<BaseViewInstanceData, TTypeData>;

export interface ViewInstanceChanges {
  updatedAt: Date;
  view?: string;
}

// An { [id]: ViewInstance | null } map,
// (null if view instance does not exist).
export type ViewInstanceMap<T extends ViewInstance = ViewInstance> = Record<
  string,
  T | null
>;
