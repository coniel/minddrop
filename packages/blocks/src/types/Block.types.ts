import { ContentColor } from '@minddrop/core';

export interface CoreBlockProperties {
  /**
   * A unique identifier for the block.
   */
  id: string;

  /**
   * The block type.
   */
  type: string;

  /**
   * Timestamp of when the block was created.
   */
  created: Date;

  /**
   * Timestamp of when the block was last modified.
   */
  lastModified: Date;

  /**
   * Controls which variant of the block will be renderer. If absent,
   * the default variant will be used.
   *
   * Must be the ID of a registered variant. If the variant is not
   * found, the default variant will be used.
   */
  variant?: string;

  /**
   * The block title. Can be set by the user or automatically
   * when creating a block (e.g. web page title).
   */
  title?: string;

  /**
   * Plain text describing the block content. Can be set by the user
   * or automatically when creating a block (e.g. web wpage description).
   */
  description?: string;

  /**
   * The block's text content in markdown format.
   */
  text?: string;

  /**
   * The filename of the file associated with the block.
   */
  file?: string;

  /**
   * The URL associated with the block.
   */
  url?: string;

  /**
   * The block color chosen by the user. Block variants may use this
   * to highlgiht the block in the UI in different ways.
   */
  color?: ContentColor;

  /**
   * The block icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon?: string;

  /**
   * Filename of a document asset. Usefull for associating a decorative image
   * with a block, such as a cover image or webpage thumbnail.
   *
   * **Note**: Not intended to be used as the main content of the block. If the
   * block is an image, use the `file` property instead.
   */
  image?: string;

  /**
   * A date associated with the block. Can be used for full day events, deadlines,
   * publication date, etc.
   */
  date?: Date;

  /**
   * A start date associated with the block, e.g. for events.
   */
  startDate?: Date;

  /**
   * An end date associated with the block, e.g. for events.
   */
  endDate?: Date;

  /**
   * IDs of blocks that are children of this block.
   */
  children?: string[];
}

export type CoreBlockData = Omit<
  CoreBlockProperties,
  'id' | 'type' | 'variant' | 'created' | 'lastModified'
>;

export type CustomBlockData = Record<string, unknown>;

export type BlockData<TCustomData extends CustomBlockData = {}> =
  CoreBlockData & TCustomData;

export type Block<TCustomData extends CustomBlockData = {}> =
  CoreBlockProperties & TCustomData;

export type DeserializedBlockData<TCustomData extends CustomBlockData = {}> =
  Omit<Block, 'created' | 'lastModified' | 'date' | 'startDate' | 'endDate'> &
    TCustomData & {
      created: string;
      lastModified: string;
      date: string;
      startDate: string;
      endDate: string;
    };

export type BlockTemplate<TCustomData extends CustomBlockData = {}> = Omit<
  Block<TCustomData>,
  'id' | 'created' | 'lastModified'
>;
