import { cardStatus, cardType, LOADING_STATE } from "../redux/modules/cards";

/*    DATAS  */

export const entity_test = {
  Title: "test",
  Status: cardStatus.TODO,
  Type: cardType.Task,
  CreatedAt: new Date(2000, 1, 1, 12, 0, 0, 0)
};
export const entity_test_created = {
  Id: "1",
  ...entity_test,
  CreatedAt: new Date(2000, 1, 1, 12, 0, 0, 0)
};

export const entity_test_2criteria_false = {
  Criterias: [{ Id: "1", Value: false }, { Id: "2", Value: false }]
};

export const entity_test_created_with_criterias = {
  ...entity_test_created,
  ...entity_test_2criteria_false
};

export const expect_loadingstate = ({ type, state } = {}) =>
  Object.values(cardType).reduce(
    (acc, ct) => ({ ...acc, [ct]: type === ct ? state : LOADING_STATE.NULL }),
    {}
  );

export const stateWith1Card = {
  list: [entity_test_created],
  status: expect_loadingstate()
};
export const stateWithDynCard = card => ({
  list: card,
  status: expect_loadingstate()
});
export const storeStateInitial = {
  cards: { list: [], status: expect_loadingstate() }
};
export const storeStateWith1Card = {
  cards: { list: [entity_test_created], status: expect_loadingstate() }
};
export const storeStateDyn = cards => {
  return {
    cards: { list: cards, status: expect_loadingstate() }
  };
};

it("fake test", () => {
  expect(true).toBe(true);
});
