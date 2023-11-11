import { ContentColor } from '@minddrop/core';
import { ContentIconName, EmojiSkinTone } from '@minddrop/icons';

export enum WorkspaceIconType {
  Default = 'default',
  Emoji = 'emoji',
  ContentIcon = 'content-icon',
}

export type WorkspaceIconDefault = { type: WorkspaceIconType.Default };

export type WorkspaceIconEmoji = {
  type: WorkspaceIconType.Emoji;
  icon: string;
  skinTone: EmojiSkinTone;
};

export type WorkspaceIconContentIcon = {
  type: WorkspaceIconType.ContentIcon;
  icon: ContentIconName;
  color: ContentColor;
};

export type WorkspaceIcon =
  | WorkspaceIconDefault
  | WorkspaceIconEmoji
  | WorkspaceIconContentIcon;
