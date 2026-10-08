import { BackgroundSettings, DesignElement } from '@minddrop/designs-next';

/**
 * How the picture fits its block. Cover crops it to fill the block,
 * contain shows the whole picture inside it, and fill stretches it
 * to the block.
 */
export type ImageFit = 'cover' | 'contain' | 'fill';

export interface ImageElement
  extends DesignElement,
    Pick<BackgroundSettings, 'cornerRadius'> {
  /**
   * How the picture fits its block. Absent means cover.
   */
  fit?: ImageFit;
}
