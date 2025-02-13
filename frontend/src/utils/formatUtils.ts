export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes >= 1_000_000_000) {
    return `${(sizeInBytes / 1_000_000_000).toFixed(2)} GB`;
  } else if (sizeInBytes >= 1_000_000) {
    return `${(sizeInBytes / 1_000_000).toFixed(2)} MB`;
  } else {
    return `${(sizeInBytes / 1_000).toFixed(2)} KB`;
  }
};
