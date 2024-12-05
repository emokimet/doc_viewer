import React, { useState, useEffect } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { LoadingSpinner } from '../LoadingSpinner';
import mammoth from 'mammoth';
import pptx2json from 'pptx2json';

interface DocumentViewerProps {
  fileUrl: string;
  fileType?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ fileUrl, fileType = 'pdf' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<string>('');
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        
        if (fileType === 'document') {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setContent(result.value);
        } else if (fileType === 'presentation') {
          const response = await fetch(fileUrl);
          const arrayBuffer = await response.arrayBuffer();
          
          const pptxContent = await pptx2json.parseArrayBuffer(arrayBuffer);
          const formattedContent = formatPresentationContent(pptxContent);
          setContent(formattedContent);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading document:', error);
        setContent('<div class="text-red-500">Error loading document</div>');
        setIsLoading(false);
      }
    };

    if (fileType === 'document' || fileType === 'presentation') {
      loadDocument();
    }
  }, [fileUrl, fileType]);

  const formatPresentationContent = (pptxContent: any) => {
    return pptxContent.slides.map((slide: any, index: number) => `
      <div class="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Slide ${index + 1}</h2>
        ${slide.texts.map((text: any) => `
          <p class="mb-2">${text.text}</p>
        `).join('')}
      </div>
    `).join('');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (fileType === 'pdf') {
    return (
      <div className="w-full h-[800px] bg-white rounded-lg shadow">
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={SpecialZoomLevel.PageFit}
            onDocumentLoad={() => setIsLoading(false)}
            renderError={(error) => (
              <div className="w-full p-4 text-center text-red-500 bg-red-50 rounded-lg">
                <p className="font-medium">Failed to load PDF: {error.message}</p>
              </div>
            )}
          />
        </Worker>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow p-6">
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default DocumentViewer;