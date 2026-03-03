import type { editor } from 'monaco-editor';

/**
 * VS Code "Dark+ (default dark)" theme for Monaco editor.
 * Extends the built-in vs-dark base with additional token color rules.
 */
export const darkPlusTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '6A9955' },

    // Strings
    { token: 'string', foreground: 'CE9178' },
    { token: 'string.escape', foreground: 'D7BA7D' },

    // Regular expressions
    { token: 'regexp', foreground: 'D16969' },

    // Keywords and storage
    { token: 'keyword', foreground: '569CD6' },
    { token: 'keyword.flow', foreground: 'C586C0' },
    { token: 'keyword.type', foreground: '4EC9B0' },
    { token: 'keyword.control', foreground: 'C586C0' },
    { token: 'keyword.operator', foreground: 'D4D4D4' },
    { token: 'keyword.operator.new', foreground: '569CD6' },
    { token: 'keyword.operator.expression', foreground: '569CD6' },

    // Storage
    { token: 'storage', foreground: '569CD6' },
    { token: 'storage.type', foreground: '569CD6' },

    // Constants
    { token: 'constant', foreground: '569CD6' },
    { token: 'constant.language', foreground: '569CD6' },
    { token: 'constant.numeric', foreground: 'B5CEA8' },

    // Variables
    { token: 'variable', foreground: '9DDCFE' },
    { token: 'variable.parameter', foreground: '9DDCFE' },
    { token: 'variable.other.constant', foreground: '9DDCFE' },

    // Functions
    { token: 'entity.name.function', foreground: 'DCDCAA' },
    { token: 'support.function', foreground: 'DCDCAA' },
    { token: 'function.identifier', foreground: 'DCDCAA' },

    // Types and classes
    { token: 'entity.name.type', foreground: '4EC9B0' },
    { token: 'support.type', foreground: '4EC9B0' },
    { token: 'support.class', foreground: '4EC9B0' },

    // Tags (HTML/XML)
    { token: 'entity.name.tag', foreground: '569CD6' },
    { token: 'tag', foreground: '569CD6' },
    { token: 'tag.id.pug', foreground: '4EC9B0' },
    { token: 'tag.class.pug', foreground: '4EC9B0' },

    // Attributes
    { token: 'entity.other.attribute-name', foreground: '9CDCFE' },
    { token: 'attribute.name', foreground: '9CDCFE' },
    { token: 'attribute.value', foreground: 'CE9178' },

    // CSS
    { token: 'support.constant.property-value', foreground: 'CE9178' },
    { token: 'support.constant.color', foreground: 'CE9178' },
    { token: 'support.constant.font-name', foreground: 'CE9178' },
    { token: 'entity.other.attribute-name.class.css', foreground: 'D7BA7D' },
    { token: 'entity.other.attribute-name.id.css', foreground: 'D7BA7D' },
    { token: 'support.type.property-name.css', foreground: '9CDCFE' },
    { token: 'attribute.name.css', foreground: 'D7BA7D' },
    { token: 'attribute.value.css', foreground: 'CE9178' },
    { token: 'attribute.value.number.css', foreground: 'B5CEA8' },
    { token: 'attribute.value.unit.css', foreground: 'B5CEA8' },

    // Enums
    { token: 'variable.other.enummember', foreground: '4FC1FF' },

    // Invalid / deprecated
    { token: 'invalid', foreground: 'F44747' },
    { token: 'invalid.deprecated', foreground: 'D4D4D4' },

    // Markdown
    { token: 'markup.heading', foreground: '569CD6', fontStyle: 'bold' },
    { token: 'markup.bold', fontStyle: 'bold' },
    { token: 'markup.italic', fontStyle: 'italic' },
    { token: 'markup.inserted', foreground: 'B5CEA8' },
    { token: 'markup.deleted', foreground: 'CE9178' },
    { token: 'markup.changed', foreground: '569CD6' },
    { token: 'markup.inline.raw', foreground: 'CE9178' },

    // JSON
    { token: 'support.type.property-name.json', foreground: '9CDCFE' },
    { token: 'string.key.json', foreground: '9CDCFE' },
    { token: 'string.value.json', foreground: 'CE9178' },

    // TypeScript / JavaScript specific
    { token: 'type', foreground: '4EC9B0' },
    { token: 'type.identifier', foreground: '4EC9B0' },
    { token: 'delimiter', foreground: 'D4D4D4' },
    { token: 'delimiter.bracket', foreground: 'D4D4D4' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'identifier', foreground: '9DDCFE' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#C6C6C6',
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#3A3D41',
    'editorIndentGuide.background': '#404040',
    'editorIndentGuide.activeBackground': '#707070',
  },
};
