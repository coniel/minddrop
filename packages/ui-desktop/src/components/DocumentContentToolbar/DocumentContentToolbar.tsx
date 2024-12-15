import { useEffect, useState } from 'react';
import { useBlockTypes } from '@minddrop/blocks';
import { useTranslation } from '@minddrop/i18n';
import { Selection, useSelection } from '@minddrop/selection';
import { Separator, Toolbar } from '@minddrop/ui-elements';
import { mapPropsToClasses, useCreateCallback } from '@minddrop/utils';
import { DocumentContentToolbarBlockItem } from '../DocumentContentToolbarBlockItem';
import { DocumentContentToolbarBlockOptions } from '../DocumentContentToolbarBlockOptions';
import { DocumentContentToolbarItem } from '../DocumentContentToolbarItem';
import './DocumentContentToolbar.css';

export interface DocumentContentToolbarProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The mode of the toolbar. Controls which set of buttons
   * are displayed.
   */
  mode?: 'default' | 'custom' | 'blocks';

  /**
   * Buttons appended to the right of the toolbar.
   */
  customActions?: React.ReactNode[];

  /**
   * Custom buttons specific to the view displayed
   * when `mode` is set to 'custom'.
   */
  customModeActions?: React.ReactNode[];
}

export const DocumentContentToolbar: React.FC<DocumentContentToolbarProps> = ({
  className,
  mode = 'default',
  customActions,
  customModeActions,
  ...other
}) => {
  const { t } = useTranslation();
  const selection = useSelection();
  const { toolbarVisible, setToolbarVisible, toolbarMode, setToolbarMode } =
    useBottomToolbar();
  const blockTypes = useBlockTypes();

  useEffect(() => {
    setToolbarMode(mode);

    if (mode === 'custom') {
      setToolbarVisible(true);
    }
  }, [mode, setToolbarMode, setToolbarVisible]);

  const onDragStart = useCreateCallback(() => {
    setToolbarVisible(false);
  }, []);

  useEffect(() => {
    if (toolbarMode === 'custom') {
      return;
    }

    if (selection.length) {
      setToolbarMode('blocks');
      setToolbarVisible(true);
    } else {
      if (toolbarMode === 'blocks') {
        setToolbarVisible(false);
        setTimeout(() => {
          setToolbarMode('default');
        }, 300);
      }
    }
  }, [selection, setToolbarMode, setToolbarVisible, toolbarMode]);

  return (
    <Toolbar
      className={mapPropsToClasses(
        { className, visible: toolbarVisible },
        'document-content-toolbar',
      )}
      {...other}
    >
      {toolbarMode === 'default' && (
        <div className="section">
          {blockTypes.map((blockType) => (
            <DocumentContentToolbarBlockItem
              key={blockType.id}
              blockType={blockType}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}
      {toolbarMode === 'blocks' && (
        <>
          <DocumentContentToolbarBlockOptions />
          <Separator decorative orientation="vertical" />
          <div className="section">
            <DocumentContentToolbarItem
              icon="x"
              tooltip={t('blocks.selection.clear.action')}
              onClick={Selection.clear}
            />
          </div>
        </>
      )}
      {toolbarMode === 'custom' && (
        <div className="section">{customModeActions}</div>
      )}
      {toolbarMode !== 'blocks' && customActions && (
        <>
          <Separator decorative orientation="vertical" />
          <div className="section">{customActions}</div>
        </>
      )}
    </Toolbar>
  );
};

type ToolbarMode = 'default' | 'blocks' | 'custom';

const useBottomToolbar = () => {
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarMode, setToolbarMode] = useState<ToolbarMode>('default');

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const bottomThreshold = 200;
      const isInBottomArea =
        window.innerHeight - event.clientY <= bottomThreshold;

      setToolbarVisible(isInBottomArea || toolbarMode !== 'default');
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [toolbarMode]);

  return {
    toolbarVisible,
    toolbarMode,
    setToolbarVisible,
    setToolbarMode,
  } as const;
};
