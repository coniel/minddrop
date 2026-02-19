import { FormattedTextPropertyElement } from '../types';

export type FormattedTextPropertyElementTemplate = Omit<
  FormattedTextPropertyElement,
  'id'
>;

export const FormattedTextPropertyElementTemplate: FormattedTextPropertyElementTemplate =
  {
    type: 'formatted-text-property',
    property: '',
  };
