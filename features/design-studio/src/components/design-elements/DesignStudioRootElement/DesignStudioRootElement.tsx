import { FlexDropContainer } from '@minddrop/feature-drag-and-drop';
import { handleDropOnGap } from '../../../handleDropOnGap';
import { FlatRootDesignElement } from '../../../types';
import { getBackgroundColorStyle } from '../../../utils/getBackgroundColorStyle';
import { getBorderColorStyle } from '../../../utils/getBorderColorStyle';
import { getContainerGapValue } from '../../../utils/getContainerGapValue';
import { getElementStyleValue } from '../../../utils/getElementStyleValue';
import { DesignStudioElement } from '../DesignStudioElement';
import './DesignStudioRootElement.css';

export interface DesignStudioRootElementProps {
  element: FlatRootDesignElement;
}

export const DesignStudioRootElement: React.FC<
  DesignStudioRootElementProps
> = ({ element }) => {
  const direction = getElementStyleValue(element, 'direction');
  const gap = getContainerGapValue(element);
  const alignItems = getElementStyleValue(element, 'alignItems');
  const justifyContent = getElementStyleValue(element, 'justifyContent');
  const wrap = getElementStyleValue(element, 'wrap');
  const padding = getElementStyleValue(element, 'padding');
  const fontFamily = getElementStyleValue(element, 'font-family');
  const fontWeight = getElementStyleValue(element, 'font-weight');
  const backgroundColor = getElementStyleValue(element, 'backgroundColor');
  const borderStyle = getElementStyleValue(element, 'borderStyle');
  const borderWidth = getElementStyleValue(element, 'borderWidth');
  const borderColor = getElementStyleValue(element, 'borderColor');
  const borderRadius = getElementStyleValue(element, 'borderRadius');
  const opacity = getElementStyleValue(element, 'opacity');

  const resolvedFontFamily = fontFamily === 'inherit' ? 'sans' : fontFamily;
  const fontFamilyCss = `var(--font-${resolvedFontFamily})`;

  return (
    <FlexDropContainer
      id="root"
      gap={gap}
      direction={direction}
      align={alignItems}
      justify={justifyContent}
      className="design-studio-root-element"
      style={{
        flexWrap: wrap ? 'wrap' : 'nowrap',
        padding: `${padding}px`,
        fontFamily: fontFamilyCss,
        fontWeight,
        backgroundColor: getBackgroundColorStyle(backgroundColor),
        borderStyle,
        borderWidth: `${borderWidth}px`,
        borderColor: getBorderColorStyle(borderColor),
        borderRadius: `${borderRadius}px`,
        opacity,
      }}
      onDrop={handleDropOnGap}
    >
      {element.children.map((childId, index) => (
        <DesignStudioElement
          key={childId}
          elementId={childId}
          index={index}
          gap={gap}
          isLastChild={index === element.children.length - 1}
        />
      ))}
    </FlexDropContainer>
  );
};
