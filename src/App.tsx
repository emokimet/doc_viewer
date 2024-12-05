import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import FileUploader from './components/FileUploader';
import DocumentViewer from './components/viewers/DocumentViewer';
import ImageViewer from './components/viewers/ImageViewer';
import TextViewer from './components/viewers/TextViewer';
import SpreadsheetViewer from './components/viewers/SpreadsheetViewer';
import { getFileType, createFileUrl, cleanupFileUrl } from './utils/fileUtils';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  useEffect(() => {
    return () => {
      if (fileUrl) {
        cleanupFileUrl(fileUrl);
      }
    };
  }, [fileUrl]);

  const handleFileSelect = (selectedFile: File) => {
    if (fileUrl) {
      cleanupFileUrl(fileUrl);
    }
    const url = createFileUrl(selectedFile);
    setFile(selectedFile);
    setFileUrl(url);
    setFileType(getFileType(selectedFile));
  };

  const renderViewer = () => {
    if (!file || !fileUrl) return null;

    switch (fileType) {
      case 'document':
      case 'presentation':
        return <DocumentViewer fileUrl={fileUrl} fileType={fileType} />;
      case 'spreadsheet':
        return <SpreadsheetViewer fileUrl={fileUrl} />;
      case 'image':
        return <ImageViewer fileUrl={fileUrl} />;
      default:
        return <TextViewer fileUrl={fileUrl} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <FileText className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Document Viewer</h1>
        </div>

        <div className="mb-8 flex justify-center">
          <FileUploader onFileSelect={handleFileSelect} />
        </div>

        <ErrorBoundary>
          {file && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  {file.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Type: {fileType} | Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {renderViewer()}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;