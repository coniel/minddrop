import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationNotFoundError } from '../errors';
import {
  MockFs,
  automation_1,
  automation_virtual_1,
  cleanup,
  setup,
} from '../test-utils';
import { resolveAutomationFilePath, resolveAutomationsDirPath } from '../utils';
import { writeAutomation } from './writeAutomation';

describe('writeAutomation', () => {
  beforeEach(() => setup({ loadAutomationFiles: false }));

  afterEach(cleanup);

  it('throws an error if the automation does not exist', async () => {
    await expect(() => writeAutomation('missing')).rejects.toThrow(
      AutomationNotFoundError,
    );
  });

  it('throws an error if the automation is virtual', async () => {
    // Add a virtual automation to the store
    AutomationsStore.set(automation_virtual_1);

    await expect(() =>
      writeAutomation(automation_virtual_1.id),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('creates the automations directory if it does not exist', async () => {
    // Remove the automations directory
    MockFs.removeDir(resolveAutomationsDirPath());

    await writeAutomation(automation_1.id);

    expect(MockFs.exists(resolveAutomationsDirPath())).toBe(true);
  });

  it('writes the automation config to the file system', async () => {
    await writeAutomation(automation_1.id);

    // Get the written automation config from the file system
    const automation = MockFs.readJsonFile(
      resolveAutomationFilePath(automation_1.id),
    );

    expect(automation).toEqual(automation_1);
  });
});
