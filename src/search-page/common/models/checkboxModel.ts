export type CheckboxModel = {
  id: number;
  value: string;
};

// TODO : REMOVE => Hardcoded
const hiphop: CheckboxModel = {
  id: 1,
  value: "Hip Hop"
};

const jazz: CheckboxModel = {
  id: 2,
  value: "Jazz"
};

const rNb: CheckboxModel = {
  id: 3,
  value: "R&B"
};

const rap: CheckboxModel = {
  id: 4,
  value: "Rap"
};

export const genres: CheckboxModel[] = [hiphop, jazz, rNb, rap];

const acoustiness: CheckboxModel = {
  id: 1,
  value: "Acousticness"
};

const danceability: CheckboxModel = {
  id: 2,
  value: "Danceability"
};

const energy: CheckboxModel = {
  id: 3,
  value: "Energy"
};

const instrumentalness: CheckboxModel = {
  id: 4,
  value: "Instrumentalness"
};

const liveness: CheckboxModel = {
  id: 5,
  value: "Liveness"
};

const loudness: CheckboxModel = {
  id: 6,
  value: "Loudness"
};

export const primitives: CheckboxModel[] = [
  acoustiness,
  danceability,
  energy,
  instrumentalness,
  liveness,
  loudness
];
