import Tasks from "./tasks";

export const api = db => {
  return { Tasks: Tasks(db) };
};
