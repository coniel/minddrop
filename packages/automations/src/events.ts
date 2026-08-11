import { Automation } from './types';

export const AutomationCreatedEvent = 'automations:automation:created';
export const AutomationUpdatedEvent = 'automations:automation:updated';
export const AutomationDeletedEvent = 'automations:automation:deleted';
export const AutomationsLoadedEvent = 'automations:loaded';

export type AutomationCreatedEventData = Automation;

export type AutomationUpdatedEventData = {
  original: Automation;
  updated: Automation;
};

export type AutomationDeletedEventData = Automation;

export type AutomationsLoadedEventData = Automation[];
