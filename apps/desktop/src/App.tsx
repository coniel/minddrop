import { useEffect } from 'react';
import { fs, path } from '@tauri-apps/api';
import './App.css';
import {
  FsFileOptions,
  FsDirOptions,
  initializeCore,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { useThemeAppearance, Theme } from '@minddrop/theme';
import { Button } from '@minddrop/ui';
import { Topics } from '@minddrop/topics';

const core = initializeCore({ extensionId: 'app' });

function convertFsOptions(options: FsFileOptions | FsDirOptions): fs.FsOptions {
  const opts: fs.FsOptions = {};

  if (options.dir === 'app-data') {
    opts.dir = fs.BaseDirectory.AppData;
  }

  if (options.dir === 'workspace') {
    opts.dir = fs.BaseDirectory.Desktop;
  }

  return opts;
}

registerFileSystemAdapter({
  copyFile: async (source, destination, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.copyFile(source, destination, opts);
  },
  createDir: async (dir, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.createDir(dir, opts);
  },
  exists: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.exists(path, opts);
  },
  readBinaryFile: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.readBinaryFile(path, opts);
  },
  readDir: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.readDir(path, opts);
  },
  readTextFile: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.readTextFile(path, opts);
  },
  removeDir: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.removeDir(path, opts);
  },
  removeFile: async (path, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.removeFile(path, opts);
  },
  renameFile: async (oldPath, newPath, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.renameFile(oldPath, newPath, opts);
  },
  writeBinaryFile: async (path, contents, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.writeBinaryFile(path, contents, opts);
  },
  writeTextFile: async (path, contents, options) => {
    const opts = options ? convertFsOptions(options) : undefined;

    return fs.writeTextFile(path, contents, opts);
  },
});

function App() {
  const themeAppearance = useThemeAppearance();

  useEffect(() => {
    // Toggle the theme appearance class on <body>
    // whenever the theme appearance value is changes.
    if (themeAppearance === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }, [themeAppearance]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    /* setGreetMsg(await invoke('greet', { name })); */
    const desktop = await path.desktopDir();
    await Topics.load(core, `${desktop}MindDrop`);
    performance.mark('start');
    await Topics.rename(core, `${desktop}MindDrop/Morrowind.md`, 'Stop Skooma');
    performance.mark('end');
    console.log(performance.measure('run', 'start', 'end'));
    /* console.log(getAll()); */
    /* Theme.setAppearanceSetting( */
    /*   core, */
    /*   themeAppearance === 'dark' ? 'light' : 'dark', */
    /* ); */
    /* Theme.setAppearance(core, themeAppearance === 'dark' ? 'light' : 'dark'); */
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row"></div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <Button type="submit">Greet</Button>
        </form>
      </div>
    </div>
  );
}

export default App;
