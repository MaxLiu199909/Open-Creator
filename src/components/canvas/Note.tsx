import React, { useRef, useEffect } from 'react';
import { Text, Transformer, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CanvasItem } from './Canvas';

interface NoteProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasItem>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
}

export const Note: React.FC<NoteProps> = ({
  item,
  isSelected,
  onSelect,
  onChange,
  onDragEnd
}) => {
  const shapeRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        x={item.x}
        y={item.y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={onDragEnd}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      >
        <Text
          text={item.content}
          width={item.width}
          height={item.height}
          fill="#333"
          padding={10}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            const minWidth = 5;
            const minHeight = 5;
            const maxWidth = 800;
            const maxHeight = 800;

            if (
              newBox.width < minWidth ||
              newBox.height < minHeight ||
              newBox.width > maxWidth ||
              newBox.height > maxHeight
            ) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};
