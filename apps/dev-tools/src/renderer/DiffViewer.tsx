import type { Monaco } from '@monaco-editor/react';
import { DiffEditor, Editor, loader } from '@monaco-editor/react';
import type { IDisposable, editor } from 'monaco-editor';
import { initVimMode } from 'monaco-vim';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NewReviewComment, ReviewComment } from '../types';
import { CommentPopover } from './CommentPopover';
import { darkPlusTheme } from './darkPlusTheme';
import type { RevealRequest, SelectedFile, ViewMode } from './types';
import './DiffViewer.css';

// Register the Dark+ theme and custom TypeScript tokenizer before any editor mounts
loader.init().then((monaco) => {
  monaco.editor.defineTheme('dark-plus', darkPlusTheme);
  registerTypescriptTokenizer(monaco);
});

// Space needed below a selection to fit the comment popover before it
// flips above the selection
const POPOVER_HEIGHT = 200;
const POPOVER_WIDTH = 360;
const COMMENT_BUTTON_HEIGHT = 24;

/**
 * Where the current selection ends, relative to the editor container.
 */
interface SelectionAnchor {
  /**
   * Top of the selection's last line.
   */
  top: number;

  /**
   * Bottom of the selection's last line.
   */
  bottom: number;

  /**
   * Horizontal position of the selection end.
   */
  left: number;
}

/**
 * A comment being written for a code selection.
 */
interface CommentDraft {
  /**
   * First line of the selection.
   */
  startLine: number;

  /**
   * Last line of the selection.
   */
  endLine: number;

  /**
   * The full text of the selected lines.
   */
  snippet: string;

  /**
   * Where the selection ended when the draft was opened.
   */
  anchor: SelectionAnchor;
}

/**
 * A mounted diff editor and the text models it shows.
 */
interface MountedDiffEditor {
  /**
   * The diff editor instance.
   */
  instance: editor.IStandaloneDiffEditor;

  /**
   * The original and modified text models.
   */
  models: editor.IDiffEditorModel;

  /**
   * Whether the editor instance has been disposed.
   */
  disposed: boolean;
}

interface DiffViewerProps {
  /**
   * The currently selected file.
   */
  selectedFile: SelectedFile;

  /**
   * The active view mode (diff, original, or current).
   */
  viewMode: ViewMode;

  /**
   * Called when the view mode tab is changed.
   */
  onViewModeChange: (mode: ViewMode) => void;

  /**
   * File content at the base ref.
   */
  originalContent: string;

  /**
   * Current file content on disk.
   */
  currentContent: string;

  /**
   * Whether to render the diff side-by-side (true) or inline (false).
   */
  splitDiff: boolean;

  /**
   * Called when the split/inline diff toggle is changed.
   */
  onSplitDiffChange: (split: boolean) => void;

  /**
   * Review comments of the file's work group.
   */
  comments: ReviewComment[];

  /**
   * The id of the comment currently highlighted, if any.
   */
  focusedCommentId: string | null;

  /**
   * A request to scroll a line into view.
   */
  reveal: RevealRequest | null;

  /**
   * Whether the file accepts review comments.
   */
  canComment: boolean;

  /**
   * Called with a new comment on the selected code.
   */
  onCreateComment: (comment: NewReviewComment) => void;

  /**
   * Called when a comment's gutter marker is clicked.
   */
  onFocusComment: (id: string) => void;
}

/**
 * Renders a Monaco diff editor with view mode tabs for reviewing file
 * changes, with review comment markers and a comment popover on the
 * current content.
 */
export const DiffViewer: React.FC<DiffViewerProps> = ({
  selectedFile,
  viewMode,
  onViewModeChange,
  originalContent,
  currentContent,
  splitDiff,
  onSplitDiffChange,
  comments,
  focusedCommentId,
  reveal,
  canComment,
  onCreateComment,
  onFocusComment,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const vimModeRef = useRef<ReturnType<typeof initVimMode> | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  // The diff editor while its view is mounted, so its models can be
  // disposed after it
  const diffEditorRef = useRef<MountedDiffEditor | null>(null);
  // The editor showing current content, which is the one that can be
  // commented on
  const activeEditorRef = useRef<editor.ICodeEditor | null>(null);
  const editorListenersRef = useRef<IDisposable[]>([]);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(
    null,
  );
  // The last reveal request applied, so a remount does not repeat it
  const revealedTokenRef = useRef<number | null>(null);
  const fileCommentsRef = useRef<ReviewComment[]>([]);
  const onFocusCommentRef = useRef(onFocusComment);
  const [selectionAnchor, setSelectionAnchor] =
    useState<SelectionAnchor | null>(null);
  const [draft, setDraft] = useState<CommentDraft | null>(null);
  // Whether a comment on the file as a whole is being written
  const [isFileDraftOpen, setIsFileDraftOpen] = useState(false);
  // Bumped whenever a commentable editor mounts so effects depending
  // on it re-run
  const [editorVersion, setEditorVersion] = useState(0);

  // Infer language from file extension
  const language = getLanguageFromPath(selectedFile.path);

  // Comments anchored to the selected file
  const fileComments = useMemo(
    () => comments.filter((comment) => comment.file === selectedFile.path),
    [comments, selectedFile.path],
  );

  // Keep editor listeners on the latest comments and callback
  fileCommentsRef.current = fileComments;
  onFocusCommentRef.current = onFocusComment;

  // Dispose any active vim mode instance
  const disposeVim = useCallback(() => {
    if (vimModeRef.current) {
      vimModeRef.current.dispose();
      vimModeRef.current = null;
    }
  }, []);

  // Attach vim mode to an editor instance
  const attachVim = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      disposeVim();
      vimModeRef.current = initVimMode(editorInstance, statusBarRef.current);
    },
    [disposeVim],
  );

  // Drop the listeners and decorations of the commentable editor
  const detachActiveEditor = useCallback(() => {
    for (const listener of editorListenersRef.current) {
      listener.dispose();
    }

    editorListenersRef.current = [];
    decorationsRef.current = null;
    activeEditorRef.current = null;
    setSelectionAnchor(null);
  }, []);

  // Compute where the commentable editor's selection ends, relative
  // to the editor container
  const resolveSelectionAnchor = useCallback((): SelectionAnchor | null => {
    const editorInstance = activeEditorRef.current;
    const container = containerRef.current;
    const selection = editorInstance?.getSelection();
    const editorNode = editorInstance?.getDomNode();

    if (
      !editorInstance ||
      !container ||
      !selection ||
      !editorNode ||
      selection.isEmpty()
    ) {
      return null;
    }

    const position = editorInstance.getScrolledVisiblePosition(
      selection.getEndPosition(),
    );

    if (!position) {
      return null;
    }

    // Offset by the editor's own position, which in a split diff is
    // the right-hand half of the container
    const editorRect = editorNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const top = editorRect.top - containerRect.top + position.top;

    return {
      top,
      bottom: top + position.height,
      left: editorRect.left - containerRect.left + position.left,
    };
  }, []);

  // Track the selection end for the comment button
  const updateSelectionAnchor = useCallback(() => {
    setSelectionAnchor(resolveSelectionAnchor());
  }, [resolveSelectionAnchor]);

  // Open a comment draft for the current selection
  const openDraft = useCallback(() => {
    const editorInstance = activeEditorRef.current;
    const model = editorInstance?.getModel();
    const selection = editorInstance?.getSelection();
    const anchor = resolveSelectionAnchor();

    if (!canComment || !model || !selection || !anchor) {
      return;
    }

    const startLine = selection.startLineNumber;
    let endLine = selection.endLineNumber;

    // A selection ending at the start of a line does not include it
    if (endLine > startLine && selection.endColumn === 1) {
      endLine -= 1;
    }

    // Quote the whole selected lines so the anchor can be re-found
    const snippet = model.getValueInRange({
      startLineNumber: startLine,
      startColumn: 1,
      endLineNumber: endLine,
      endColumn: model.getLineMaxColumn(endLine),
    });

    setIsFileDraftOpen(false);
    setDraft({ startLine, endLine, snippet, anchor });
  }, [canComment, resolveSelectionAnchor]);

  // Listen to the commentable editor's selection, scrolling and
  // gutter clicks
  const attachActiveEditor = useCallback(
    (editorInstance: editor.ICodeEditor, monaco: Monaco) => {
      detachActiveEditor();
      monacoRef.current = monaco;
      activeEditorRef.current = editorInstance;
      editorListenersRef.current = [
        editorInstance.onDidChangeCursorSelection(updateSelectionAnchor),
        editorInstance.onDidScrollChange(updateSelectionAnchor),
        editorInstance.onMouseDown((event) => {
          // Clicking a gutter marker focuses its comment
          if (
            event.target.type !==
            monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
          ) {
            return;
          }

          const line = event.target.position?.lineNumber;
          const comment = fileCommentsRef.current.find(
            (candidate) =>
              line !== undefined &&
              candidate.startLine !== null &&
              candidate.endLine !== null &&
              line >= candidate.startLine &&
              line <= candidate.endLine,
          );

          if (comment) {
            onFocusCommentRef.current(comment.id);
          }
        }),
      ];
      setEditorVersion((version) => version + 1);
    },
    [detachActiveEditor, updateSelectionAnchor],
  );

  // Handle current content editor mount
  const handleCurrentEditorMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      attachVim(editorInstance);
      attachActiveEditor(editorInstance, monaco);
      editorInstance.focus();
    },
    [attachVim, attachActiveEditor],
  );

  // Handle original content editor mount, which cannot be commented on
  const handleOriginalEditorMount = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      attachVim(editorInstance);
      editorInstance.focus();
    },
    [attachVim],
  );

  // Handle diff editor mount (attach vim and comments to modified editor)
  const handleDiffEditorMount = useCallback(
    (diffEditor: editor.IStandaloneDiffEditor, monaco: Monaco) => {
      const modifiedEditor = diffEditor.getModifiedEditor();
      const models = diffEditor.getModel();

      if (models) {
        const mounted: MountedDiffEditor = {
          instance: diffEditor,
          models,
          disposed: false,
        };

        // The diff editor never fires its own dispose event, but it
        // disposes its inner editors, which do
        modifiedEditor.onDidDispose(() => {
          mounted.disposed = true;
        });
        diffEditorRef.current = mounted;
      }

      attachVim(modifiedEditor);
      attachActiveEditor(modifiedEditor, monaco);
      modifiedEditor.focus();
    },
    [attachVim, attachActiveEditor],
  );

  // Clean up vim mode on unmount
  useEffect(() => {
    return disposeVim;
  }, [disposeVim]);

  // Drop the commentable editor when its view unmounts
  useEffect(() => {
    return detachActiveEditor;
  }, [viewMode, detachActiveEditor]);

  // Dispose the diff editor's models once its view has unmounted
  useEffect(() => {
    if (viewMode !== 'diff') {
      return;
    }

    return () => {
      const mounted = diffEditorRef.current;

      if (!mounted) {
        return;
      }

      diffEditorRef.current = null;
      disposeDiffEditorModels(mounted);
    };
  }, [viewMode]);

  // Discard the drafts when the file or view changes
  useEffect(() => {
    setDraft(null);
    setIsFileDraftOpen(false);
  }, [selectedFile.path, viewMode]);

  // Mark commented lines in the commentable editor
  useEffect(() => {
    const monaco = monacoRef.current;
    const editorInstance = activeEditorRef.current;

    if (!monaco || !editorInstance) {
      return;
    }

    if (!decorationsRef.current) {
      decorationsRef.current = editorInstance.createDecorationsCollection();
    }

    decorationsRef.current.set(
      fileComments
        .filter((comment) => comment.startLine !== null)
        .map((comment) => ({
          range: new monaco.Range(
            comment.startLine ?? 1,
            1,
            comment.endLine ?? comment.startLine ?? 1,
            1,
          ),
          options: {
            isWholeLine: true,
            className: resolveDecorationClass(
              'review-comment-line',
              comment,
              focusedCommentId,
            ),
            glyphMarginClassName: resolveDecorationClass(
              'review-comment-glyph',
              comment,
              focusedCommentId,
            ),
            glyphMarginHoverMessage: { value: comment.text },
          },
        })),
    );
  }, [fileComments, focusedCommentId, editorVersion]);

  // Scroll a requested line into view once a commentable editor exists
  useEffect(() => {
    const editorInstance = activeEditorRef.current;

    if (
      !reveal ||
      !editorInstance ||
      revealedTokenRef.current === reveal.token
    ) {
      return;
    }

    revealedTokenRef.current = reveal.token;
    editorInstance.revealLineInCenter(reveal.line);
  }, [reveal, editorVersion]);

  // Open a comment draft on the file as a whole
  const openFileDraft = useCallback(() => {
    if (!canComment) {
      return;
    }

    setDraft(null);
    setIsFileDraftOpen(true);
  }, [canComment]);

  // Keyboard shortcuts: enter or ctrl+m to comment on the selection,
  // ctrl+shift+m to comment on the file
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Enter only applies while the editor holds a selection, so it
      // keeps its meaning in the comment textarea and elsewhere
      if (event.key === 'Enter') {
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.shiftKey ||
          !hasEditorSelection(activeEditorRef.current)
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        openDraft();

        return;
      }

      if (!event.ctrlKey || event.key.toLowerCase() !== 'm') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (event.shiftKey) {
        openFileDraft();
      } else {
        openDraft();
      }
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, [openDraft, openFileDraft]);

  // Save the draft as a comment and return focus to the editor
  const handleSubmitDraft = (text: string) => {
    if (!draft) {
      return;
    }

    onCreateComment({
      file: selectedFile.path,
      startLine: draft.startLine,
      endLine: draft.endLine,
      snippet: draft.snippet,
      text,
    });
    setDraft(null);
    activeEditorRef.current?.focus();
  };

  // Discard the draft and return focus to the editor
  const handleCancelDraft = () => {
    setDraft(null);
    activeEditorRef.current?.focus();
  };

  // Save the file draft as a file-level comment
  const handleSubmitFileDraft = (text: string) => {
    onCreateComment({
      file: selectedFile.path,
      startLine: null,
      endLine: null,
      snippet: null,
      text,
    });
    setIsFileDraftOpen(false);
    activeEditorRef.current?.focus();
  };

  // Discard the file draft and return focus to the editor
  const handleCancelFileDraft = () => {
    setIsFileDraftOpen(false);
    activeEditorRef.current?.focus();
  };

  // Keep the editor selection when clicking the comment button
  const handleCommentButtonMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  // Whether to show the comment button for the current selection
  const showCommentButton =
    canComment && selectionAnchor !== null && !draft && !isFileDraftOpen;

  return (
    <div className="diff-viewer">
      <div className="diff-viewer-toolbar">
        <div className="diff-viewer-path" title={selectedFile.path}>
          {selectedFile.path}
        </div>

        <div className="diff-viewer-tabs">
          {canComment && (
            <button
              className="diff-viewer-tab diff-viewer-file-comment"
              onClick={openFileDraft}
              title="Comment on this file (ctrl+shift+m)"
            >
              + File comment
            </button>
          )}

          <button
            className={`diff-viewer-tab diff-viewer-split-toggle ${viewMode === 'diff' ? '' : 'disabled'}`}
            onClick={() => onSplitDiffChange(!splitDiff)}
            title={splitDiff ? 'Switch to inline diff' : 'Switch to split diff'}
          >
            {splitDiff ? 'Split' : 'Inline'}
          </button>

          <TabButton
            label="Diff"
            active={viewMode === 'diff'}
            onClick={() => onViewModeChange('diff')}
          />
          <TabButton
            label="Original"
            active={viewMode === 'original'}
            onClick={() => onViewModeChange('original')}
          />
          <TabButton
            label="Current"
            active={viewMode === 'current'}
            onClick={() => onViewModeChange('current')}
          />
        </div>
      </div>

      <div className="diff-viewer-editor" ref={containerRef}>
        {viewMode === 'diff' && (
          <DiffEditor
            original={originalContent}
            modified={currentContent}
            language={language}
            theme="dark-plus"
            onMount={handleDiffEditorMount}
            // The models are disposed after the editor, see
            // disposeDiffEditorModels
            keepCurrentOriginalModel
            keepCurrentModifiedModel
            options={{
              readOnly: true,
              renderSideBySide: splitDiff,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              glyphMargin: true,
            }}
          />
        )}

        {viewMode === 'original' && (
          <Editor
            value={originalContent}
            language={language}
            theme="dark-plus"
            onMount={handleOriginalEditorMount}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
            }}
          />
        )}

        {viewMode === 'current' && (
          <Editor
            value={currentContent}
            language={language}
            theme="dark-plus"
            onMount={handleCurrentEditorMount}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              glyphMargin: true,
            }}
          />
        )}

        {showCommentButton && (
          <button
            className="comment-button"
            style={resolveCommentButtonStyle(
              selectionAnchor,
              containerRef.current,
            )}
            onMouseDown={handleCommentButtonMouseDown}
            onClick={openDraft}
            title="Comment on selection (enter)"
          >
            Comment
          </button>
        )}

        {draft && (
          <CommentPopover
            label={formatLineRange(draft.startLine, draft.endLine)}
            style={resolvePopoverStyle(draft.anchor, containerRef.current)}
            onSubmit={handleSubmitDraft}
            onCancel={handleCancelDraft}
          />
        )}

        {isFileDraftOpen && (
          <CommentPopover
            label={`File: ${selectedFile.path}`}
            style={{ top: 8, right: 8 }}
            onSubmit={handleSubmitFileDraft}
            onCancel={handleCancelFileDraft}
          />
        )}
      </div>

      <div className="diff-viewer-statusbar" ref={statusBarRef} />
    </div>
  );
};

/**
 * Detaches and disposes the models of an unmounted diff editor.
 * @monaco-editor/react disposes the models while they are still
 * attached, which Monaco reports as an error, so the editor keeps them
 * and they are reset here first.
 *
 * @param mounted - The unmounted diff editor and its models.
 */
function disposeDiffEditorModels(mounted: MountedDiffEditor): void {
  // A disposed editor has already let go of the models
  if (!mounted.disposed) {
    mounted.instance.setModel(null);
  }

  mounted.models.original.dispose();
  mounted.models.modified.dispose();
}

/**
 * Renders a single tab button in the view mode toolbar.
 */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`diff-viewer-tab ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * Returns whether the editor has focus and a non-empty selection.
 */
function hasEditorSelection(
  editorInstance: editor.ICodeEditor | null,
): boolean {
  const selection = editorInstance?.getSelection();

  return (
    !!editorInstance &&
    editorInstance.hasTextFocus() &&
    !!selection &&
    !selection.isEmpty()
  );
}

/**
 * Formats a line range label, collapsing single-line ranges.
 */
function formatLineRange(startLine: number, endLine: number): string {
  if (startLine === endLine) {
    return `Line ${startLine}`;
  }

  return `Lines ${startLine}-${endLine}`;
}

/**
 * Builds a decoration class name reflecting the comment's status and
 * whether it is the focused comment.
 */
function resolveDecorationClass(
  base: string,
  comment: ReviewComment,
  focusedCommentId: string | null,
): string {
  const classes = [base];

  if (comment.status === 'resolved') {
    classes.push(`${base}-resolved`);
  }

  if (comment.id === focusedCommentId) {
    classes.push(`${base}-focused`);
  }

  return classes.join(' ');
}

/**
 * Positions the comment button just below the selection end, kept
 * inside the editor container.
 */
function resolveCommentButtonStyle(
  anchor: SelectionAnchor,
  container: HTMLDivElement | null,
): React.CSSProperties {
  const width = container?.clientWidth ?? 0;
  const height = container?.clientHeight ?? 0;

  return {
    top: Math.max(
      0,
      Math.min(anchor.bottom + 4, height - COMMENT_BUTTON_HEIGHT - 4),
    ),
    left: Math.max(8, Math.min(anchor.left, width - 90)),
  };
}

/**
 * Positions the comment popover below the selection end, flipping
 * above it when there is not enough room below.
 */
function resolvePopoverStyle(
  anchor: SelectionAnchor,
  container: HTMLDivElement | null,
): React.CSSProperties {
  const width = container?.clientWidth ?? 0;
  const height = container?.clientHeight ?? 0;
  const left = Math.max(8, Math.min(anchor.left, width - POPOVER_WIDTH - 8));

  // Flip above the selection when it would overflow the bottom
  if (anchor.bottom + POPOVER_HEIGHT > height && anchor.top > POPOVER_HEIGHT) {
    return { left, bottom: height - anchor.top + 4 };
  }

  return { left, top: anchor.bottom + 4 };
}

/**
 * Maps file extensions to Monaco editor language identifiers.
 */
function getLanguageFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    html: 'html',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    sh: 'shell',
    bash: 'shell',
    py: 'python',
    rs: 'rust',
    go: 'go',
    sql: 'sql',
    xml: 'xml',
    svg: 'xml',
  };

  return languageMap[extension] ?? 'plaintext';
}

// Control flow keywords that should be colored with keyword.flow
const CONTROL_FLOW_KEYWORDS = [
  'async',
  'await',
  'break',
  'case',
  'catch',
  'continue',
  'debugger',
  'default',
  'do',
  'else',
  'finally',
  'for',
  'if',
  'return',
  'switch',
  'throw',
  'try',
  'while',
  'with',
  'yield',
  'of',
  'in',
];

// Primitive type keywords that should be colored like type names
const TYPE_KEYWORDS = [
  'any',
  'bigint',
  'boolean',
  'never',
  'null',
  'number',
  'object',
  'string',
  'symbol',
  'undefined',
  'unique',
  'unknown',
  'void',
];

// Declaration and other keywords that keep the standard keyword color
const DECLARATION_KEYWORDS = [
  'abstract',
  'as',
  'asserts',
  'class',
  'const',
  'constructor',
  'declare',
  'delete',
  'enum',
  'export',
  'extends',
  'false',
  'from',
  'function',
  'get',
  'global',
  'implements',
  'import',
  'infer',
  'instanceof',
  'interface',
  'is',
  'keyof',
  'let',
  'module',
  'namespace',
  'new',
  'out',
  'override',
  'package',
  'private',
  'protected',
  'public',
  'readonly',
  'require',
  'satisfies',
  'set',
  'static',
  'super',
  'this',
  'true',
  'type',
  'typeof',
  'var',
];

/**
 * Registers a custom Monarch tokenizer for TypeScript and JavaScript that
 * splits keywords into control flow (keyword.flow) and declaration (keyword)
 * categories for distinct syntax highlighting.
 */
function registerTypescriptTokenizer(monaco: Monaco) {
  const tokenizer: import('monaco-editor').languages.IMonarchLanguage = {
    defaultToken: 'invalid',
    tokenPostfix: '.ts',
    controlKeywords: CONTROL_FLOW_KEYWORDS,
    typeKeywords: TYPE_KEYWORDS,
    keywords: DECLARATION_KEYWORDS,
    operators: [
      '<=',
      '>=',
      '==',
      '!=',
      '===',
      '!==',
      '=>',
      '+',
      '-',
      '**',
      '*',
      '/',
      '%',
      '++',
      '--',
      '<<',
      '</',
      '>>',
      '>>>',
      '&',
      '|',
      '^',
      '!',
      '~',
      '&&',
      '||',
      '??',
      '?',
      ':',
      '=',
      '+=',
      '-=',
      '*=',
      '**=',
      '/=',
      '%=',
      '<<=',
      '>>=',
      '>>>=',
      '&=',
      '|=',
      '^=',
      '@',
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes:
      /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
    regexpesc:
      /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
    tokenizer: {
      root: [[/[{}]/, 'delimiter.bracket'], { include: 'common' }],
      common: [
        // Lowercase identifiers followed by ( are function calls
        [
          /#?[a-z_$][\w$]*(?=\s*\()/,
          {
            cases: {
              '@controlKeywords': 'keyword.flow',
              '@typeKeywords': 'keyword.type',
              '@keywords': 'keyword',
              '@default': 'function.identifier',
            },
          },
        ],
        // Other lowercase identifiers
        [
          /#?[a-z_$][\w$]*/,
          {
            cases: {
              '@controlKeywords': 'keyword.flow',
              '@typeKeywords': 'keyword.type',
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],
        // PascalCase identifiers (types) — must contain a lowercase letter
        [/[A-Z][\w$]*[a-z][\w$]*/, 'type.identifier'],
        // ALL_CAPS identifiers (constants)
        [/[A-Z][\w$]*/, 'identifier'],
        { include: '@whitespace' },
        [
          /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
          { token: 'regexp', bracket: '@open', next: '@regexp' },
        ],
        [/[()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/!(?=([^=]|$))/, 'delimiter'],
        [
          /@symbols/,
          {
            cases: {
              '@operators': 'delimiter',
              '@default': '',
            },
          },
        ],
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
        [/0[xX](@hexdigits)n?/, 'number.hex'],
        [/0[oO]?(@octaldigits)n?/, 'number.octal'],
        [/0[bB](@binarydigits)n?/, 'number.binary'],
        [/(@digits)n?/, 'number'],
        [/[;,.]/, 'delimiter'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
      ],
      whitespace: [
        [/[ \t\r\n]+/, ''],
        [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],
      jsdoc: [
        [/[^\/*]+/, 'comment.doc'],
        [/\*\//, 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc'],
      ],
      regexp: [
        [
          /(\{)(\d+(?:,\d*)?)(\})/,
          [
            'regexp.escape.control',
            'regexp.escape.control',
            'regexp.escape.control',
          ],
        ],
        [
          /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
          [
            'regexp.escape.control',
            { token: 'regexp.escape.control', next: '@regexrange' },
          ],
        ],
        [
          /(\()(\?:|\?=|\?!)/,
          ['regexp.escape.control', 'regexp.escape.control'],
        ],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'],
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [
          /(\/)([dgimsuy]*)/,
          [
            { token: 'regexp', bracket: '@close', next: '@pop' },
            'keyword.other',
          ],
        ],
      ],
      regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [
          /\]/,
          {
            token: 'regexp.escape.control',
            next: '@pop',
            bracket: '@close',
          },
        ],
      ],
      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ],
      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop'],
      ],
      string_backtick: [
        [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop'],
      ],
      bracketCounting: [
        [/\{/, 'delimiter.bracket', '@bracketCounting'],
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'common' },
      ],
    },
  };

  // Register for both TypeScript and JavaScript
  monaco.languages.setMonarchTokensProvider('typescript', tokenizer);
  monaco.languages.setMonarchTokensProvider('javascript', {
    ...tokenizer,
    tokenPostfix: '.js',
  });
}
