import { DocumentTypeConfig } from '@minddrop/documents';
import { Ast, BlockElement } from '@minddrop/ast';
import { DefaultNoteProperties } from './constants';
import { parseNoteProperties } from './parseNoteProperties';
import { parseNoteContent } from './parseNoteContent';
import { stringifyNote } from './stringifyNote';
import { NoteView } from './NoteView';

export const NoteDocumentTypeConfig: DocumentTypeConfig<BlockElement[]> = {
  fileType: 'md',
  initialize: (title) => ({
    properties: DefaultNoteProperties,
    content: Ast.fromMarkdown(`# ${title}`),
  }),
  parseProperties: parseNoteProperties,
  parseContent: parseNoteContent,
  stringify: stringifyNote,
  component: NoteView,
};
