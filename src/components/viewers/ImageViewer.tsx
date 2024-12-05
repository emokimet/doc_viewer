import React from 'react';

interface ImageViewerProps {
  fileUrl: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ fileUrl }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={fileUrl}
        alt="Preview"
        className="max-w-full max-h-[80vh] object-contain"
      />
    </div>
  );
};

export default ImageViewer;