import { BaseDirectory } from '@minddrop/file-system';
import { UserIcon, UserIconContentIcon, UserIconType } from '@minddrop/icons';

export const CollectionsConfigDir = BaseDirectory.AppConfig;
export const CollectionsConfigFileName = 'collections.json';
export const CollectionConfigDirName = '.minddrop';
export const CollectionConfigFileName = 'collection.json';
export const CollectionHistoryDirName = 'History';
export const CollectionAnnotationsDirName = 'Annotations';

export const DefaultCollectionIcon: UserIcon = {
  type: UserIconType.ContentIcon,
  icon: 'folder',
  color: 'default',
};
export const MissingCollectionIcon: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'alert-circle',
  color: 'red',
};
