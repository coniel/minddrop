import { DesignRoleConfig } from '../types';

/**
 * The card's cover image, spanning the full card width.
 */
export const CardCoverRole: DesignRoleConfig = {
  id: 'card-cover',
  elementType: 'image',
  label: 'designs.roles.card-cover.label',
  icon: 'image',
  lockedStyle: {
    aspectRatio: 'landscape',
    objectFit: 'cover',
    width: 'full',
  },
  bindsPropertyTypes: ['image'],
  context: { designTypes: ['database'], layoutTypes: ['card'] },
};
