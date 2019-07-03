export type GenreModel = {
  name: string;
  percentage: number;
  color: string;
};

// TODO: Remove - Hardcoded
export const Genres = (): any[] => {
  return [
    { name: "Hip-hop", percentage: 40 },
    { name: "Rap", percentage: 30 },
    { name: "Pop", percentage: 10 },
    { name: "Rock", percentage: 20 }
  ];
};
