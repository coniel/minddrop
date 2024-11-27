import { Ast } from '@minddrop/ast';
import { Documents } from '@minddrop/documents';
import { EditorMarks, EditorElements } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import { Blocks } from '../../blocks/src';
import { Selection } from '@minddrop/Selection';
import { Workspaces } from '@minddrop/workspaces';
import * as Utils from '@minddrop/utils';
import * as Ui from '@minddrop/ui';
import { MindDropApi as Api } from './types';

export const MindDropApi: Api = {
  Ast,
  Documents,
  EditorMarks,
  EditorElements,
  Events,
  Fs,
  Icons,
  Markdown,
  Blocks,
  Selection,
  Ui,
  Utils,
  Workspaces,
};
