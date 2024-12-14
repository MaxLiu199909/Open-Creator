import React, { useRef, useEffect } from 'react';
import { Group, Transformer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Html } from 'react-konva-utils';
import { CanvasItem } from './Canvas';

interface VideoItemProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasItem>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
}

export const VideoItem: React.FC<VideoItemProps> = ({
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
        <Html>
          <video
            src={item.content}
            width={item.width}
            height={item.height}
            controls
            style={{
              border: isSelected ? '2px solid #00ff00' : 'none',
            }}
          />
        </Html>
      </Group>
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
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
