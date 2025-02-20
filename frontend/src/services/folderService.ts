import axiosInstance from "@/services/api";
import { SortingOptions } from "@/types";

export const getFolderContent = async (
  folderId: number,
  sortBy: SortingOptions
) => {
  const response = await axiosInstance.get(`filesystem/folders/${folderId}`, {
    params: {
      sort_by_folders: sortBy.folders,
      order_folders: sortBy.orderFolders,
      sort_by_files: sortBy.files,
      order_files: sortBy.orderFiles,
    },
  });
  return response.data;
};

export const getFolderPath = async (folderId: number) => {
  const response = await axiosInstance.get(
    `filesystem/folders/${folderId}/path`
  );
  return response.data;
};

export const createFolder = async (folderName: string, parentId: number) => {
  const response = await axiosInstance.post(
    `filesystem/folders?parent_id=${parentId}`,
    {
      name: folderName,
    }
  );
  return response.data;
};

export const updateFolder = async (folderId: number, folderName: string) => {
  const response = await axiosInstance.patch(`filesystem/folders/${folderId}`, {
    name: folderName,
  });
  return response.data;
};

export const downloadFolder = async (
  folderId: number,
  onProgress?: (progress: number) => void
) => {
  const response = await axiosInstance.get(
    `filesystem/folders/${folderId}/download`,
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
  let filename = "archivo.zip";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    if (match) {
      filename = match[1];
    }
  }

  return { blob: response.data, filename };
};

export const deleteFolder = async (folderId: number) => {
  const response = await axiosInstance.delete(`filesystem/folders/${folderId}`);
  return response.data;
};
