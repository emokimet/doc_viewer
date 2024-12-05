import React, { useEffect, useState } from 'react';

interface TextViewerProps {
  fileUrl: string;
}

const TextViewer: React.FC<TextViewerProps> = ({ fileUrl }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(fileUrl)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error('Error loading text file:', error));
  }, [fileUrl]);

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow">
      <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    </div>
  );
};

export default TextViewer;