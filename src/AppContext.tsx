import * as React from "react";
import {
  CheckboxModel,
  PrimitiveCheckboxModel
} from "search-page/common/models/checkboxModel";
import { Song } from "common/api/songs";

type AppContext = {
  loggedIn: boolean;
  language: string;
  playedTrack: Song | null;
  genres: CheckboxModel[];
  primitives: PrimitiveCheckboxModel[];
  unselectedPrimitiveIdList: number[];
  updateUnselectedPrimitiveIdList: (id: number, checked: boolean) => void;
  unselectedGenreIdList: number[];
  updateUnselectedGenreIdList: (id: number, checked: boolean) => void;
  userUncheckAllPrimitives: () => void;
  userCheckAllPrimitives: () => void;
  userUncheckAllGenres: () => void;
  userCheckAllGenres: () => void;
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
  unselectedPrimitiveIdList: [],
  unselectedGenreIdList: [],
  userUncheckAllPrimitives: () => {
    throw new Error("userUncheckAllPrimitives() not implemented");
  },
  userCheckAllPrimitives: () => {
    throw new Error("userCheckAllPrimitives() not implemented");
  },
  userUncheckAllGenres: () => {
    throw new Error("userUncheckAllGenres() not implemented");
  },
  userCheckAllGenres: () => {
    throw new Error("userCheckAllGenres() not implemented");
  },
  updateUnselectedPrimitiveIdList: () => {
    throw new Error("updateUnselectedPrimitiveIdList() not implemented");
  },
  updateUnselectedGenreIdList: () => {
    throw new Error("updateUnselectedGenreIdList() not implemented");
  },
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
