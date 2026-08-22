import { MockFileDescriptor } from '@minddrop/file-system';
import { Automation } from '../types';
import { resolveAutomationFilePath, resolveAutomationsDirPath } from '../utils';

function generateAutomationFixture(number: number): Automation {
  return {
    id: `automation_${number}`,
    name: `Automation ${number}`,
    icon: 'content-icon:zap:default',
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    enabled: true,
    nodes: [
      {
        id: `automation-node_trigger-${number}`,
        type: 'trigger',
        x: 0,
        y: 0,
      },
      {
        id: `automation-node_action-${number}`,
        type: 'action',
        x: 300,
        y: 0,
      },
    ],
    connections: [
      {
        id: `automation-connection_a-${number}`,
        from: `automation-node_trigger-${number}`,
        to: `automation-node_action-${number}`,
      },
    ],
  };
}

export const automation_1 = generateAutomationFixture(1);
export const automation_2 = generateAutomationFixture(2);
export const automation_3 = generateAutomationFixture(3);

export const automations = [automation_1, automation_2, automation_3];

// An automation owned and persisted by another entity rather
// than by an automation file
export const automation_virtual_1: Automation = {
  ...generateAutomationFixture(4),
  virtual: true,
  owner: 'database_1',
};

// All automations including the virtual ones
export const allAutomations = [...automations, automation_virtual_1];

export function getAutomationFiles(): (string | MockFileDescriptor)[] {
  return [
    resolveAutomationsDirPath(),
    ...automations.map((automation) => ({
      path: resolveAutomationFilePath(automation.id),
      textContent: JSON.stringify(automation),
    })),
  ];
}
