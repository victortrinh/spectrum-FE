export type CheckboxModel = {
  id: number;
  value: string;
  selected: boolean;
};

// TODO : REMOVE => Hardcoded
const hiphop: CheckboxModel = {
  id: 1,
  value: "Hip Hop",
  selected: true
};

const jazz: CheckboxModel = {
  id: 2,
  value: "Jazz",
  selected: true
};

const rNb: CheckboxModel = {
  id: 3,
  value: "R&B",
  selected: false
};

const rap: CheckboxModel = {
  id: 4,
  value: "Rap",
  selected: true
};

export const genres: CheckboxModel[] = [hiphop, jazz, rNb, rap];

const acoustiness: CheckboxModel = {
  id: 1,
  value: "Acousticness",
  selected: true
};

const danceability: CheckboxModel = {
  id: 2,
  value: "Danceability",
  selected: true
};

const energy: CheckboxModel = {
  id: 3,
  value: "Energy",
  selected: true
};

const instrumentalness: CheckboxModel = {
  id: 4,
  value: "Instrumentalness",
  selected: false
};

const liveness: CheckboxModel = {
  id: 5,
  value: "Liveness",
  selected: true
};

const loudness: CheckboxModel = {
  id: 6,
  value: "Loudness",
  selected: false
};

export const primitives: CheckboxModel[] = [
  acoustiness,
  danceability,
  energy,
  instrumentalness,
  liveness,
  loudness
];
