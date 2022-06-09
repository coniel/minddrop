import { TRDTypeData, TypedResourceDocument } from '@minddrop/resources';

export interface BaseViewInstanceData {
  /**
   * The ID of the extension that created the view.
   */
  extension: string;
}

export type ViewInstanceTypeData = TRDTypeData<BaseViewInstanceData>;

export type ViewInstance<TTypeData extends ViewInstanceTypeData = {}> =
  TypedResourceDocument<BaseViewInstanceData, TTypeData>;

export interface ViewInstanceChanges {
  updatedAt: Date;
}

// An { [id]: ViewInstance } map
export type ViewInstanceMap<TData extends ViewInstanceTypeData = {}> = Record<
  string,
  ViewInstance<TData>
>;
