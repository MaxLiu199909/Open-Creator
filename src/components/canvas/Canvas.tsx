import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Note } from './Note';
import { ImageItem } from './ImageItem';
import { VideoItem } from './VideoItem';
import { Transformer } from 'react-konva';

export type CanvasItem = {
  id: string;
  type: 'note' | 'image' | 'video';
  x: number;
  y: number;
  content: string;
  width?: number;
  height?: number;
};

const Canvas: React.FC = () => {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
  };

  const handleAddNote = () => {
    const newNote: CanvasItem = {
      id: `note-${Date.now()}`,
      type: 'note',
      x: 100,
      y: 100,
      content: 'New Note',
      width: 200,
      height: 100,
    };
    setItems([...items, newNote]);
  };

  const handleAddImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: CanvasItem = {
        id: `image-${Date.now()}`,
        type: 'image',
        x: 100,
        y: 100,
        content: e.target?.result as string,
        width: 200,
        height: 200,
      };
      setItems([...items, newImage]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideo = (file: File) => {
    // Check if video is under 5 minutes
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (video.duration > 300) { // 5 minutes = 300 seconds
        alert('Video must be under 5 minutes');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const newVideo: CanvasItem = {
          id: `video-${Date.now()}`,
          type: 'video',
          x: 100,
          y: 100,
          content: e.target?.result as string,
          width: 320,
          height: 240,
        };
        setItems([...items, newVideo]);
      };
      reader.readAsDataURL(file);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const updatedItems = items.map(i =>
        i.id === id ? { ...i, x: e.target.x(), y: e.target.y() } : i
      );
      setItems(updatedItems);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 space-x-2">
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleAddImage(e.target.files[0])}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add Image
        </label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && handleAddVideo(e.target.files[0])}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add Video
        </label>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={(e) => {
          if (e.target === e.target.getStage()) {
            handleSelect(null);
          }
        }}
      >
        <Layer>
          {items.map((item) => {
            switch (item.type) {
              case 'note':
                return (
                  <Note
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => handleSelect(item.id)}
                    onChange={(newAttrs) => {
                      const updatedItems = items.map(i =>
                        i.id === item.id ? { ...i, ...newAttrs } : i
                      );
                      setItems(updatedItems);
                    }}
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
                  />
                );
              case 'image':
                return (
                  <ImageItem
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => handleSelect(item.id)}
                    onChange={(newAttrs) => {
                      const updatedItems = items.map(i =>
                        i.id === item.id ? { ...i, ...newAttrs } : i
                      );
                      setItems(updatedItems);
                    }}
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
                  />
                );
              case 'video':
                return (
                  <VideoItem
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => handleSelect(item.id)}
                    onChange={(newAttrs) => {
                      const updatedItems = items.map(i =>
                        i.id === item.id ? { ...i, ...newAttrs } : i
                      );
                      setItems(updatedItems);
                    }}
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
                  />
                );
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
