export type SortValue = `${string}-${"asc" | "desc"}`;

export type SortOption = {
  value: SortValue;
  label: string;
};

// EXAMPLE USAGE:

// const sortOption: SortOption = {
//   value: "name-asc",
//   label: "Nombre: ascendente",
// }
