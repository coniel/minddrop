import { Page } from './types';

export const PageCreatedEvent = 'pages:page:created';
export const PageUpdatedEvent = 'pages:page:updated';
export const PageDeletedEvent = 'pages:page:deleted';
export const PagesLoadedEvent = 'pages:loaded';

export type PageCreatedEventData = Page;

export type PageUpdatedEventData = {
  original: Page;
  updated: Page;
};

export type PageDeletedEventData = Page;

export type PagesLoadedEventData = Page[];
