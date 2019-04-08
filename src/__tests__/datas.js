import { cardStatus, cardType, LOADING_STATE } from "../redux/modules/cards";

/*    DATAS  */

export const entity_test = {
  Title: "test",
  Status: cardStatus.TODO,
  Type: cardType.Task
};
export const entity_test_created = { Id: 1, ...entity_test };

export const stateWith1Card = {
  list: [entity_test_created],
  status: LOADING_STATE.NULL
};
export const storeStateInitial = {
  cards: { list: [], status: LOADING_STATE.NULL }
};
export const storeStateWith1Card = {
  cards: { list: [entity_test_created], status: LOADING_STATE.NULL }
};
export const storeStateDyn = card => {
  return {
    cards: { list: [entity_test_created, card], status: LOADING_STATE.NULL }
  };
};

it("fake test", () => {
  expect(true).toBe(true);
});
