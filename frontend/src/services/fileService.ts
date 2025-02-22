import axiosInstance from "@/services/api";

export const downloadFile = async (
  fileId: number,
  onProgress?: (progress: number) => void
) => {
  const response = await axiosInstance.get(
    `filesystem/files/${fileId}/download`,
    {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      },
    }
  );

  const contentDisposition = response.headers["content-disposition"];
  let filename = "";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    if (match) {
      filename = match[1];
    }
  }

  return { blob: response.data, filename };
};

export const uploadFile = async (
  files: File[],
  folderId: number,
  onUploadProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(
    `filesystem/files?folder_id=${folderId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          if (onUploadProgress) {
            onUploadProgress(percentCompleted);
          }
        }
      },
    }
  );

  return response.data;
};

export const updateFile = async (fileId: number, fileName: string) => {
  const response = await axiosInstance.patch(`filesystem/files/${fileId}`, {
    filename: fileName,
  });
  return response.data;
};

export const deleteFile = async (fileId: number) => {
  const response = await axiosInstance.delete(`filesystem/files/${fileId}`);
  return response.data;
};

export const copyFile = async (fileId: number) => {
  const response = await axiosInstance.post(`filesystem/files/${fileId}/copy`);
  return response.data;
};
