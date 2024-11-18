import { Ast } from '@minddrop/ast';
import { EditorMarks, EditorElements } from '@minddrop/editor';
import { Documents } from '@minddrop/documents';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import { Nodes } from '@minddrop/nodes';
import { Selection } from '@minddrop/selection';
import { Workspaces } from '@minddrop/workspaces';
import * as Utils from '@minddrop/utils';
import * as Ui from '@minddrop/ui';

export interface MindDropApi {
  Ast: typeof Ast;
  EditorMarks: typeof EditorMarks;
  EditorElements: typeof EditorElements;
  Documents: typeof Documents;
  Events: typeof Events;
  Fs: typeof Fs;
  Icons: typeof Icons;
  Markdown: typeof Markdown;
  Nodes: typeof Nodes;
  Selection: typeof Selection;
  Workspaces: typeof Workspaces;
  Ui: typeof Ui;
  Utils: typeof Utils;
}
