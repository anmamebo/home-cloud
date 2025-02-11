import axiosInstance from "@/config/axios";

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
