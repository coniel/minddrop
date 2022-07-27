import React, { FC, useCallback } from 'react';
import { useAllDrops } from '@minddrop/drops';
import { useAppCore, App } from '@minddrop/app';
import { Selection } from '@minddrop/selection';
import './TrashView.css';

export const TrashView: FC = () => {
  const core = useAppCore();
  // Get deleted drops
  const drops = useAllDrops({ deleted: true });

  const clearSelectedDrops = useCallback(
    // Clear selection
    () => Selection.clear(core),
    [core],
  );

  return (
    <div
      className="trash-view"
      data-testid="trash-view"
      onClick={clearSelectedDrops}
    >
      <div className="trash-content">
        {Object.values(drops)
          .sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime())
          .map((drop) =>
            App.renderDrop(drop, { resource: 'app:view', id: 'app:trash' }),
          )}
      </div>
    </div>
  );
};
