import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

export interface GeminiResponse {
  text: string;
  error?: string;
}

export async function analyzeContent(content: string | File): Promise<GeminiResponse> {
  try {
    let prompt: any;

    if (typeof content === 'string') {
      // For text notes
      prompt = `Analyze this text and provide insights: ${content}`;
    } else if (content instanceof File) {
      if (content.type.startsWith('image/')) {
        // For images
        const imageData = await fileToGenerativePart(content);
        prompt = [
          'Analyze this image and describe what you see.',
          imageData
        ];
      } else if (content.type.startsWith('video/')) {
        // For videos - extract thumbnail or first frame
        const thumbnail = await extractVideoThumbnail(content);
        const imageData = await fileToGenerativePart(thumbnail);
        prompt = [
          'Analyze this video thumbnail and describe what you see.',
          imageData
        ];
      }
    }

    if (!prompt) {
      throw new Error('Unsupported content type');
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
      text: response.text(),
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to convert File to GenerativePart
async function fileToGenerativePart(file: File): Promise<any> {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
}

// Helper function to extract video thumbnail
async function extractVideoThumbnail(videoFile: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            resolve(thumbnailFile);
          } else {
            reject(new Error('Failed to create thumbnail'));
          }
        }, 'image/jpeg');
      }
    };

    video.onerror = () => {
      reject(new Error('Error loading video'));
    };

    video.src = URL.createObjectURL(videoFile);
    // Seek to 1 second to get a representative frame
    video.currentTime = 1;
  });
}
