// Data key under which the group a dragged item was dragged out of
// is serialized into drag event data transfer objects.
export const EntityGroupSourceDataKey = 'entity-group-source';

// Prefix of the data key marking the type of group a dragged item
// was dragged out of. A drop target reads it off the drag's data
// types while the drag is over it, before the drag's data can be
// read.
export const EntityGroupSourceTypeDataKeyPrefix = 'entity-group-source-type:';
