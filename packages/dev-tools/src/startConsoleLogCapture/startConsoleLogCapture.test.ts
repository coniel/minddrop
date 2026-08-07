import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DevToolsLogsStore } from '../DevToolsLogsStore';
import { cleanup, setup } from '../test-utils';
import { startConsoleLogCapture } from './startConsoleLogCapture';

describe('startConsoleLogCapture', () => {
  let stopCapture: VoidFunction;

  beforeEach(() => {
    setup();

    stopCapture = startConsoleLogCapture();
  });

  afterEach(() => {
    stopCapture();
    cleanup();
  });

  it('captures calls to each console method', () => {
    console.log('a log');
    console.info('an info');
    console.warn('a warning');
    console.error('an error');

    expect(DevToolsLogsStore.getAll().map((entry) => entry.level)).toEqual([
      'log',
      'info',
      'warn',
      'error',
    ]);
  });

  it('captures every value passed to the call', () => {
    console.log('Databases', { count: 2 });

    expect(DevToolsLogsStore.getAll()[0].args).toEqual([
      'Databases',
      { count: 2 },
    ]);
  });

  it('records the source of the call', () => {
    console.log('a log');

    expect(DevToolsLogsStore.getAll()[0].source?.file).toBe(
      'startConsoleLogCapture.test.ts',
    );
  });

  it('stops capturing once restored', () => {
    stopCapture();

    console.log('a log');

    expect(DevToolsLogsStore.getAll()).toEqual([]);
  });
});
