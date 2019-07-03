
import * as React from "react";
import { CheckboxModel } from "search-page/common/models/checkboxModel";

type AppContext = {
  loggedIn: boolean;
  language: string;
  genres: CheckboxModel[];
  primitives: CheckboxModel[];
  setLanguage: (language: string) => void;
  getResource: (resourceKey: string) => string;
};

export default React.createContext<AppContext>({
  loggedIn: false,

  language: "",
  genres: [],
  primitives: [],
  setLanguage: () => {
    throw new Error("setLanguage() not implemented");
  },
  getResource: () => {
    throw new Error("getResource() not implemented");
  }
});
