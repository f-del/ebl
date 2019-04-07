import Cards from "./cards";

export const api = db => {
  return { Cards: Cards(db) };
};
