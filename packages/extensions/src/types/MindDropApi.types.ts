import { Assets } from '@minddrop/assets';
import { Ast } from '@minddrop/ast';
import { Blocks } from '@minddrop/blocks';
import { DocumentViews, Documents } from '@minddrop/documents';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import { Selection } from '@minddrop/selection';
import * as Utils from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { Ui } from '../Ui';

export interface MindDropApi {
  Assets: typeof Assets;
  Ast: typeof Ast;
  EditorMarks: typeof EditorMarks;
  EditorElements: typeof EditorElements;
  Documents: typeof Documents;
  DocumentViews: typeof DocumentViews;
  Events: typeof Events;
  Fs: typeof Fs;
  Icons: typeof Icons;
  Markdown: typeof Markdown;
  Blocks: typeof Blocks;
  Selection: typeof Selection;
  Workspaces: typeof Workspaces;
  Ui: typeof Ui;
  Utils: typeof Utils;
}
