import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker&inline';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker&inline';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker&inline';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker&inline';
import typescriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker&inline';

// Serve the language workers from the bundle. Inlined so they load as
// blobs rather than through the app's custom URL scheme
self.MonacoEnvironment = {
  getWorker: (_workerId, label) => createWorker(label),
};

// Use the bundled editor instead of fetching one from a CDN, which
// also keeps monaco-vim on the same instance
loader.config({ monaco });

/**
 * Creates the worker serving a language, or the plain editor worker
 * for languages without a dedicated one.
 */
function createWorker(label: string): Worker {
  if (label === 'json') {
    return new jsonWorker();
  }

  if (label === 'css' || label === 'scss' || label === 'less') {
    return new cssWorker();
  }

  if (label === 'html' || label === 'handlebars' || label === 'razor') {
    return new htmlWorker();
  }

  if (label === 'typescript' || label === 'javascript') {
    return new typescriptWorker();
  }

  return new editorWorker();
}
