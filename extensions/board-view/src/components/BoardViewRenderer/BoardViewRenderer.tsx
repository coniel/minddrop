import { useCallback } from 'react';
import { useApi, DocumentViewProps } from '@minddrop/extension';
import { BoardListSection, BoardSection, BoardView } from '../../types';
import { ColumnsSection } from '../ColumnsSection';
import { ListSection } from '../ListSection';
import { GridSection } from '../GridSection';
import './BoardViewRenderer.css';

export const BoardViewRenderer: React.FC<DocumentViewProps<BoardView>> = ({
  view,
  updateView,
  createBlocksFromDataInsert,
}) => {
  const { Selection } = useApi();

  const updateSection = useCallback(
    (index: number, data: Partial<BoardSection>) => {
      const updatedSections = [...view.sections].splice(index, 1, {
        ...view.sections[index],
        ...data,
      } as BoardListSection);

      updateView({ sections: updatedSections });
    },
    [view.sections, updateView],
  );

  return (
    <div className="board-view" onClick={Selection.clear}>
      {view.sections.map((section, index) => {
        switch (section.type) {
          case 'columns':
            return (
              <ColumnsSection
                key={section.id}
                section={section}
                createBlocksFromDataInsert={createBlocksFromDataInsert}
                updateSection={(data) => updateSection(index, data)}
              />
            );
          case 'list':
            return (
              <ListSection
                key={section.id}
                section={section}
                createBlocksFromDataInsert={createBlocksFromDataInsert}
                updateSection={(data) => updateSection(index, data)}
              />
            );
          case 'grid':
            return (
              <GridSection
                key={section.id}
                section={section}
                createBlocksFromDataInsert={createBlocksFromDataInsert}
                updateSection={(data) => updateSection(index, data)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
