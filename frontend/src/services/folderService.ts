import axiosInstance from "@/services/api";

export const getFolderContent = async (
  folderId: number,
  sortByFolders: string,
  orderFolders: string,
  sortByFiles: string,
  orderFiles: string
) => {
  const response = await axiosInstance.get(
    `filesystem/folders/${folderId}?sort_by_folders=${sortByFolders}&sort_by_files=${sortByFiles}&order_folders=${orderFolders}&order_files=${orderFiles}`
  );
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

export const downloadFolder = async (folderId: number) => {
  const response = await axiosInstance.get(
    `filesystem/folders/${folderId}/download`,
    {
      responseType: "blob",
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
