import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const handleNavigate = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {/* Breadcrumb home */}
        <BreadcrumbItem>
          {breadcrumbs.length > 0 ? (
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => navigate("/")}
            >
              Inicio
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Inicio</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {/* Folders breadcrumbs */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={crumb.id}>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => handleNavigate(crumb.id)}
                >
                  {crumb.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
