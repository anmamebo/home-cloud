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

export const uploadFile = async (file: File, folderId: number) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `filesystem/files?folder_id=${folderId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
