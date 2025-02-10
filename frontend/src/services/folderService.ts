import axiosInstance from "@/config/axios";

export const getFolderContent = async (folderId: number) => {
  const response = await axiosInstance.get(`filesystem/folders/${folderId}`);
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
