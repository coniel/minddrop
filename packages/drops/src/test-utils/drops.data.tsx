import React from 'react';
import { Resources } from '@minddrop/resources';
import { DropTypeConfig, RegisteredDropTypeConfig } from '../types';

export interface TextDropData {
  text: string;
}

export type TextDropConfig = DropTypeConfig<TextDropData>;

export const dropConfig: TextDropConfig = {
  type: 'text',
  name: 'Text',
  description: 'A text drop',
  dataTypes: ['text/plain'],
  fileTypes: ['text/plain'],
  dataSchema: { text: { type: 'string' } },
  component: ({ text }) => <div>{text}</div>,
  defaultData: { text: 'Hello world' },
  initializeData: () => ({ text: 'Hello world' }),
};

export const registeredTextDropConfig: RegisteredDropTypeConfig = {
  ...dropConfig,
  extension: 'drops',
};

export const unregisteredDropConfig: DropTypeConfig<TextDropData> = {
  type: 'unregistered',
  name: 'Unregistered',
  dataTypes: ['text/plain'],
  description: 'An unregistered drop type',
  dataSchema: { text: { type: 'string' } },
  component: () => <div />,
};

export const drop1 = Resources.generateDocument('drops:drop', {
  type: 'text',
  text: 'Lorem ipsum dolor sit amet, scripta suavitate iudicabit usu in, pro ei constituto dissentias.',
});

export const drop2 = Resources.generateDocument('drops:drop', {
  type: 'text',
  text: 'Nam ei nostro tibique aliquando. Consequat consetetur ut duo. Has tempor sententiae ad.',
});

export const drop3 = Resources.generateDocument('drops:drop', {
  type: 'text',
  text: 'Vix ei nostro prodesset, definitionem mediocritatem ne eum.',
});

export const drop4 = Resources.generateDocument('drops:drop', {
  type: 'text',
  text: 'Velit iriure incorrupte ad duo. Eu sea constituam neglegentur.',
});

export const drop5 = Resources.generateDocument('drops:drop', {
  type: 'text',
  text: 'Nam eget nunc eu mi efficitur condimentum non vitae arcu.',
});

export const drop6 = Resources.generateDocument('drops:drop', {
  type: 'text',
  text: 'Ut imperdiet luctus scelerisque.',
});

export const dropTypeConfigs = [dropConfig];

export const registeredDropTypeConfigs = [registeredTextDropConfig];

export const drops = [drop1, drop2, drop3, drop4, drop5, drop6];
