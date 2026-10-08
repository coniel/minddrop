import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { createElectrobunStub } from './createElectrobunStub';
import { registerElectrobunStubPlugin } from './registerElectrobunStubPlugin';

// Rewrites every file in a directory through fsWriteTextFiles. Each file
// is filled with the given character at its current length. Run as
// `bun writeTextFilesProcess.ts <dir> <contents character>`.

// Read the directory and the contents character from the arguments
const [dir, character] = process.argv.slice(2);

// Stub `electrobun/bun` to load the RPC module outside the Electrobun
// runtime.
registerElectrobunStubPlugin(createElectrobunStub(dir));

// Import the RPC handlers
const { fileSystemRpcHandlers } = await import('../fileSystemRpc');

// Build the new contents of every file in the directory
const names = await readdir(dir);
const entries = names.map((name) => {
  const filePath = path.join(dir, name);

  return {
    path: filePath,
    contents: character.repeat(Bun.file(filePath).size),
  };
});

// Write the new contents
await fileSystemRpcHandlers.fsWriteTextFiles({ entries });
