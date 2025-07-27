export const getDownloadUrl = (filename: string): string => {
  if (!filename) {
    return undefined;
  }
  if (filename.includes('http')) return filename;
  const host = process.env.HOST || 'http://localhost';
  const port = process.env.PORT || '3000';
  const baseUrl = host.startsWith('http') ? host : `http://${host}`;
  return `${baseUrl}:${port}/download/${filename}`;
};

export const getDownloadUrls = (filenames: string[]) => {
  if (!filenames) {
    return undefined;
  }
  return filenames?.map((name) => getDownloadUrl(name));
};
