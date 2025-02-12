import { getFolderPath } from "@/services/folderService";
import { Breadcrumb } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useBreadcrumbs = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const folderIdNumber = folderId ? parseInt(folderId, 10) : 0;

  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const fetchBreadcrumbs = useCallback(async () => {
    if (folderIdNumber === 0) {
      setBreadcrumbs([]);
      return;
    }

    try {
      const response = await getFolderPath(folderIdNumber);
      setBreadcrumbs(response.path);
    } catch (error) {
      console.error(error);
    }
  }, [folderIdNumber]);

  useEffect(() => {
    fetchBreadcrumbs();
  }, [fetchBreadcrumbs]);

  return breadcrumbs;
};
