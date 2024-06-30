import { Ast } from '@minddrop/ast';
import { Documents } from '@minddrop/documents';
import { EditorMarks, EditorElements } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import { Nodes } from '@minddrop/nodes';
import { Selection } from '@minddrop/Selection';
import { Workspaces } from '@minddrop/workspaces';
import * as Utils from '@minddrop/utils';
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
  Nodes,
  Selection,
  Utils,
  Workspaces,
};
