import { useState } from 'react';
import { Blocks } from '@minddrop/blocks';
import { Documents } from '@minddrop/documents';
import { useTranslation } from '@minddrop/i18n';
import { Selection } from '@minddrop/selection';
import {
  ContentColor,
  ContentColors,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Popover,
  PopoverAnchor,
  PopoverPortal,
} from '@minddrop/ui-elements';
import { ContentPicker } from '../ContentPicker';
import { DocumentContentToolbarItem } from '../DocumentContentToolbarItem';
import './DocumentContentToolbarBlockOptions.css';

export const DocumentContentToolbarBlockOptions: React.FC = () => {
  const { t } = useTranslation('blocks.selection');
  const [contentPickerOpen, setContentPickerOpen] = useState(false);
  const [moveTooltipOpen, setMoveTooltipOpen] = useState<boolean | undefined>();
  const [copyTooltip, setCopyTooltip] = useState('copy.action');
  const [copyTooltipOpen, setCopyTooltipOpen] = useState<boolean | undefined>();

  const openContentPicker = (event: React.MouseEvent) => {
    event.preventDefault();

    setMoveTooltipOpen(false);
    setContentPickerOpen(true);
  };

  const closeContentPicker = () => {
    setContentPickerOpen(false);
    setMoveTooltipOpen(undefined);
  };

  const move = (id: string) => {
    console.log(id);
    const blockIds = Selection.get().map(({ id }) => id);

    // Move the blocks
    Documents.moveBlocks(id, blockIds);

    setContentPickerOpen(false);
    Selection.clear();
  };

  const changeColor = (color: ContentColor) => {
    Selection.get().forEach(({ id }) => {
      // Update the block color
      Blocks.update(id, { color });
    });
  };

  const copy = (event: React.MouseEvent) => {
    event.preventDefault();
    Selection.copy();

    // Use tooltip to indicate success
    setCopyTooltip('copy.success');
    setCopyTooltipOpen(true);

    // Force close the tooltip after a delay,
    // then reset it to automatic mode.
    setTimeout(() => {
      setCopyTooltipOpen(false);
      setCopyTooltip('copy.action');
      setTimeout(() => {
        setCopyTooltipOpen(undefined);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="section">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <DocumentContentToolbarItem
            tooltip={t('color.action')}
            icon="palette"
          />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            side="top"
            align="start"
            minWidth={240}
            content={ContentColors.map((color) => ({
              type: 'menu-color-selection-item',
              color: color.value,
              onSelect: () => changeColor(color.value),
            }))}
          />
        </DropdownMenuPortal>
      </DropdownMenu>
      <Popover open={contentPickerOpen}>
        <PopoverAnchor asChild>
          <DocumentContentToolbarItem
            icon="corner-up-right"
            tooltip={t('move.action')}
            tooltipOpen={moveTooltipOpen}
            onClick={openContentPicker}
          />
        </PopoverAnchor>
        <PopoverPortal>
          <ContentPicker
            pickable="document"
            onSelect={move}
            onClose={closeContentPicker}
          />
        </PopoverPortal>
      </Popover>
      <DocumentContentToolbarItem
        tooltip={t(copyTooltip)}
        tooltipOpen={copyTooltipOpen}
        icon={copyTooltip === 'copy.success' ? 'check' : 'copy'}
        onClick={copy}
      />
      <DocumentContentToolbarItem
        tooltip={t('delete.action')}
        icon="trash-2"
        onClick={Selection.delete}
      />
    </div>
  );
};
