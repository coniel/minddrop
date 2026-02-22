import { Design, DesignType } from '../types';
import { DefaultCardDesign } from './DefaultCardDesign';
import { DefaultListDesign } from './DefaultListDesign';
import { DefaultPageDesign } from './DefaultPageDesign';

export * from './DefaultCardDesign';
export * from './DefaultListDesign';
export * from './DefaultPageDesign';

export const defaultDesignIds = [
  DefaultCardDesign.id,
  DefaultListDesign.id,
  DefaultPageDesign.id,
];

export const defaultDesigns = [
  DefaultCardDesign,
  DefaultListDesign,
  DefaultPageDesign,
];
