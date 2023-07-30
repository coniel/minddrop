import { getDropType } from './getDropType';
import { mdastNodesToDrops } from './mdastNodesToDrops';
import { DropsApi } from './types';

export const Drops: DropsApi = {
  getType: getDropType,
  fromMdast: mdastNodesToDrops,
};
