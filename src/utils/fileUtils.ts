export const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  const documentTypes = ['pdf', 'doc', 'docx'];
  const presentationTypes = ['ppt', 'pptx'];
  const spreadsheetTypes = ['xls', 'xlsx'];
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
  
  if (documentTypes.includes(extension)) return 'document';
  if (presentationTypes.includes(extension)) return 'presentation';
  if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
  if (imageTypes.includes(extension)) return 'image';
  return 'text';
};

export const createFileUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const cleanupFileUrl = (url: string) => {
  URL.revokeObjectURL(url);
};