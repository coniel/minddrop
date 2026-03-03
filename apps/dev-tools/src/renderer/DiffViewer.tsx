import type { Monaco } from '@monaco-editor/react';
import { DiffEditor, Editor, loader } from '@monaco-editor/react';
import { darkPlusTheme } from './darkPlusTheme';
import type { SelectedFile, ViewMode } from './types';
import './DiffViewer.css';

// Register the Dark+ theme and custom TypeScript tokenizer before any editor mounts
loader.init().then((monaco) => {
  monaco.editor.defineTheme('dark-plus', darkPlusTheme);
  registerTypescriptTokenizer(monaco);
});

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
}

/**
 * Renders a Monaco diff editor with view mode tabs for reviewing file changes.
 */
export const DiffViewer: React.FC<DiffViewerProps> = ({
  selectedFile,
  viewMode,
  onViewModeChange,
  originalContent,
  currentContent,
}) => {
  // Infer language from file extension
  const language = getLanguageFromPath(selectedFile.path);

  return (
    <div className="diff-viewer">
      <div className="diff-viewer-toolbar">
        <div className="diff-viewer-path" title={selectedFile.path}>
          {selectedFile.path}
        </div>

        <div className="diff-viewer-tabs">
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

      <div className="diff-viewer-editor">
        {viewMode === 'diff' && (
          <DiffEditor
            original={originalContent}
            modified={currentContent}
            language={language}
            theme="dark-plus"
            options={{
              readOnly: true,
              renderSideBySide: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
            }}
          />
        )}

        {viewMode === 'original' && (
          <Editor
            value={originalContent}
            language={language}
            theme="dark-plus"
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
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
            }}
          />
        )}
      </div>
    </div>
  );
};

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
