import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MockFs, automation_1, cleanup, setup } from '../test-utils';
import { resolveAutomationFilePath } from '../utils';
import { readAutomation } from './readAutomation';

describe('readAutomation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the automation, reviving its dates', async () => {
    const automation = await readAutomation(
      resolveAutomationFilePath(automation_1.id),
    );

    expect(automation).toEqual(automation_1);
  });

  it('returns null if the file does not exist', async () => {
    expect(
      await readAutomation(resolveAutomationFilePath('missing')),
    ).toBeNull();
  });

  it('returns null if the config has no graph', async () => {
    // Write a config missing the automation graph
    const path = resolveAutomationFilePath('automation_invalid');

    MockFs.addFiles([{ path, textContent: JSON.stringify({ name: 'Foo' }) }]);

    expect(await readAutomation(path)).toBeNull();
  });
});
