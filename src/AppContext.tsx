import * as React from "react";
import { CheckboxModel } from "search-page/common/models/checkboxModel";
import { Song } from "common/api/songs";

type AppContext = {
  loggedIn: boolean;
  language: string;
  playedTrack: Song | null;
  genres: CheckboxModel[];
  primitives: CheckboxModel[];
  setPlayedTrack: (
    playedTrack: Song
  ) => (e: React.SyntheticEvent<HTMLDivElement>) => void;
  setLanguage: (language: string) => void;
  getResource: (resourceKey: string) => string;
};

export default React.createContext<AppContext>({
  loggedIn: false,
  language: "",
  playedTrack: null,
  genres: [],
  primitives: [],
  setPlayedTrack: () => {
    throw new Error("setPlayedTrack() not implemented");
  },
  setLanguage: () => {
    throw new Error("setLanguage() not implemented");
  },
  getResource: () => {
    throw new Error("getResource() not implemented");
  }
});
