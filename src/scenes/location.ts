import { Home } from "./locations/Home";
import { YardHomes } from "./locations/YardHomes";

export const createScenes = (location: string) => {
  switch (location) {
    case "Street":
      return [YardHomes];
    case "Home":
      return [Home];
    default:
      return [Home];
  }
};
