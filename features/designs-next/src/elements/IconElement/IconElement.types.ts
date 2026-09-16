import { DesignElement, TextSettings } from '@minddrop/designs-next';

export interface IconElement
  extends DesignElement,
    Pick<TextSettings, 'textColor'> {}
