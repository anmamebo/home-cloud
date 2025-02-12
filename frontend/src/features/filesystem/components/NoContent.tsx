import noContentImage from "@/assets/no-content-folder.svg";

export const NoContent = () => {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Imagen */}
      <div className="flex justify-center h-72 w-72 bg-sidebar-accent rounded-full">
        <img src={noContentImage} alt="No hay contenido" />
      </div>

      {/* Texto */}
      <p className="font-medium">
        Parece que aún no has metido nada aquí... ¡Es hora de organizarte!
      </p>
    </div>
  );
};
