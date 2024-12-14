import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Note } from './Note';
import { ImageItem } from './ImageItem';
import { VideoItem } from './VideoItem';
import { analyzeContent } from '../../services/gemini';

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
  const [geminiResponse, setGeminiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (id: string | null) => {
    setSelectedId(id);
    if (id) {
      const selectedItem = items.find(item => item.id === id);
      if (selectedItem) {
        setIsLoading(true);
        try {
          let content: string | File;
          if (selectedItem.type === 'note') {
            content = selectedItem.content;
          } else {
            const response = await fetch(selectedItem.content);
            const blob = await response.blob();
            content = new File(
              [blob],
              `${selectedItem.type}-${Date.now()}.${selectedItem.type === 'image' ? 'png' : 'mp4'}`,
              { type: selectedItem.type === 'image' ? 'image/png' : 'video/mp4' }
            );
          }
          const result = await analyzeContent(content);
          if (result.error) {
            setGeminiResponse(`Error: ${result.error}`);
          } else {
            setGeminiResponse(result.text);
          }
        } catch (error) {
          setGeminiResponse(`Error analyzing content: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setGeminiResponse('');
    }
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
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (video.duration > 300) {
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
    <div className="flex w-full h-screen">
      <div className="flex-1 relative">
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
          width={window.innerWidth * 0.7}
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
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Gemini Analysis</h2>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : selectedId ? (
          <div className="prose">
            {geminiResponse}
          </div>
        ) : (
          <p className="text-gray-500">Select an item to analyze</p>
        )}
      </div>
    </div>
  );
};

export default Canvas;
