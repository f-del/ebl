import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import {
  entity_test,
  entity_test_created,
  entity_test_2criteria_false,
  storeStateInitial,
  storeStateWith1Card,
  stateWith1Card,
  storeStateDyn,
  stateWithDynCard,
  entity_test_created_with_criterias,
  entity_test_criteria_basic
} from "../datas";
import {
  createCard,
  cardType,
  cardStatus,
  getAllCards,
  startCard,
  createCardSuccess,
  setCardCriteria,
  getAllCardsInProgess,
  getAllCardsTodo,
  retrieveAllCards,
  retrieveAllCards_Starting,
  retrieveAllCards_End,
  LOADING_STATE,
  getLoadingStatus,
  toggleCardCriteria,
  doneCard,
  getCard,
  getAllCardsDone,
  updateCardStatusForward,
  addCriteria,
  setCriteriasTypology
} from "../../redux/modules/cards";
import * as criteriaRedux from "../../redux/modules/criterias";
import reducer from "../../redux/store/index";
import cardReducer from "../../redux/modules/cards";
import { criteriaType } from "../../redux/modules/criterias";

var middlewares = undefined;
var store,
  mockStore = undefined;
var fnMockPostCards,
  fnMockGetCards = undefined;
var api = undefined;

const create_action = {
  type: "CARD/CREATE",
  payload: {
    Id: "1",
    ...entity_test
  }
};
const start_action = {
  type: "CARD/STARTED",
  payload: {
    Id: "1"
  }
};

const done_action = {
  type: "CARD/DONE",
  payload: {
    Id: "1"
  }
};

const setCardCriteria_action = {
  type: "CARD/CRITERIA/SET",
  payload: {
    Id: "1",
    Criteria: {
      Id: "1",
      Value: true
    }
  }
};
const retrieve_start_action = {
  type: "CARD/RETRIEVE/START",
  payload: {}
};
const retrieve_end_action = {
  type: "CARD/RETRIEVE/END",
  payload: { cards: [entity_test_created] }
};

const addCriteria_action = {
  type: "CARD/CRITERIA/ADD",
  payload: { Id: "1", Criteria: { Id: "critId1", Value: "default" } }
};

describe("API tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    fnMockPostCards = jest.fn(() => {
      return new Promise((resolve, reject) => {
        // use firestore API
        setTimeout(t => {
          resolve({ Id: -9999 });
        }, 100);
      });
    });
    api = {
      Cards: {
        Post: fnMockPostCards
      }
    };
    fnMockGetCards = jest.fn(() => {
      return new Promise((resolve, reject) => {
        setTimeout(t => {
          resolve([entity_test_created]);
        }, 100);
      });
    });
    api = {
      Cards: {
        Post: fnMockPostCards,
        Get: fnMockGetCards
      }
    };
    middlewares = [thunk.withExtraArgument({ api })];
    mockStore = configureMockStore(middlewares);
    store = createStore(
      reducer,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );
  });
  test.skip("call action createcard & expect change in state with getAllCards selector", async () => {
    fnMockPostCards.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(t => {
            resolve({ Id: 555 });
          }, 20);
        })
    );
    await store.dispatch(createCard("test"));
    expect(getAllCards(store.getState()).length).toBe(1);
  });

  test.skip("call action createcard then call action startcard & expect getAllCardsInProgess selector", async () => {
    fnMockPostCards.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(t => {
            resolve({ Id: 555 });
          }, 20);
        })
    );

    await store.dispatch(createCard("test"));
    expect(getAllCardsTodo(store.getState()).length).toBe(1);
    expect(getAllCardsInProgess(store.getState()).length).toBe(0);
    await store.dispatch(startCard(555));

    expect(getAllCardsTodo(store.getState()).length).toBe(0);
    expect(getAllCardsInProgess(store.getState()).length).toBe(1);
    await store.dispatch(createCard("test 2"));
    const todoCards = getAllCardsTodo(store.getState());
    expect(todoCards.length).toBe(1);
    expect(todoCards[0].Id).toBe(-9999);
    const inprogCards = getAllCardsInProgess(store.getState());
    expect(inprogCards.length).toBe(1);
    expect(inprogCards[0].Id).toBe(555);
  });

  test.skip("call action getAllCards and expect to retrieve cards in state", async () => {
    fnMockGetCards.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(t => {
            resolve([
              entity_test_created,
              { ...entity_test_created, Id: 22, Status: cardStatus.INPROGRESS }
            ]);
          }, 20);
        })
    );

    await store.dispatch(retrieveAllCards(cardType.Task));

    expect(getAllCards(store.getState()).length).toBe(2);
    expect(getAllCardsTodo(store.getState()).length).toBe(1);
    expect(getAllCardsInProgess(store.getState()).length).toBe(1);
  });

  test.skip("retrieve all cards in // calls, expect only 1 call on API Get", async done => {
    const fn1 = async () => {
      await store.dispatch(retrieveAllCards(cardType.Task));
    };

    const fn2 = async () => {
      await store.dispatch(retrieveAllCards(cardType.Task));
    };

    await Promise.all([fn1(), fn2()]);

    expect(fnMockGetCards.mock.calls.length).toBe(1);
    done();
  });

  test.skip("Toogle 1 Card Criteria to true on card with 1 criterias set to true", async () => {
    const card = {
      ...entity_test_created,
      Status: cardStatus.INPROGRESS,
      Criterias: [{ Id: "1", Value: false }, { Id: "2", Value: true }]
    };
    const initialStore = storeStateDyn([card]);

    fnMockPostCards.mockImplementationOnce(
      (id, criteria) =>
        new Promise((resolve, reject) => {
          setTimeout(t => {
            resolve({ Update: true });
          }, 20);
        })
    );

    store = createStore(
      reducer,
      initialStore,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );

    await store.dispatch(toggleCardCriteria("1", "1", true));

    expect(fnMockPostCards.mock.calls.length).toBe(1);
    expect(fnMockPostCards.mock.calls[0][0]).toEqual(card);
    expect(fnMockPostCards.mock.calls[0][1]).toEqual({ Id: "1", Value: true });
    expect(getCard(store.getState(), "1")).toEqual({
      ...entity_test_created,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: true }],
      Status: cardStatus.DONE
    });
  });

  test.skip("Expect that toogle to false an already truthy criteria is blocked", async () => {
    const initialStore = storeStateDyn([entity_test_created_with_criterias]);

    store = createStore(
      reducer,
      initialStore,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );

    await store.dispatch(toggleCardCriteria("1", "1", true));
    expect(getCard(store.getState(), "1")).toEqual({
      ...entity_test_created,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: false }],
      Status: cardStatus.TODO
    });

    await store.dispatch(toggleCardCriteria("1", "1", false));

    expect(getCard(store.getState(), "1")).toEqual({
      ...entity_test_created,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: false }],
      Status: cardStatus.TODO
    });
  });

  describe("Unit tests", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test.skip("create a card without title", () => {
      const wrapper = () => {
        const store = mockStore(storeStateInitial);
        store.dispatch(createCard());
      };
      expect(wrapper).toThrowError("Argument title is mandatory");
    });
    test.skip("create a card", async () => {
      const store = mockStore(storeStateInitial);

      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve({ Id: "10" });
            }, 20);
          })
      );

      await store.dispatch(createCard("test"));

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toEqual(entity_test);
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual({
        type: "CARD/CREATE",
        payload: {
          Id: "10",
          Title: "test",
          Status: cardStatus.TODO,
          Type: cardType.Task
        }
      });
    });

    test("Affect a BASIC Dod Criterias typology to a card (no parameter)", async () => {
      const store = mockStore(storeStateWith1Card);

      criteriaRedux.getCriteria = jest.fn((state, basic) => {
        return entity_test_criteria_basic;
      });

      await store.dispatch(setCriteriasTypology());

      expect(criteriaRedux.getCriteria.mock.calls.length).toBe(1);
      expect(criteriaRedux.getCriteria.mock.calls[0][1]).toEqual(
        criteriaType.BASIC
      );
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual(addCriteria_action);
    });
    test("Affect a BASIC Dod Criterias typology to a card", async () => {
      const store = mockStore(storeStateWith1Card);

      criteriaRedux.getCriteria = jest.fn((state, basic) => {
        return entity_test_criteria_basic;
      });
      await store.dispatch(setCriteriasTypology(criteriaType.BASIC));

      expect(criteriaRedux.getCriteria.mock.calls.length).toBe(1);
      expect(criteriaRedux.getCriteria.mock.calls[0][1]).toEqual(
        criteriaType.BASIC
      );
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual(addCriteria_action);
    });

    test("Affect a Dev Dod Criterias typology to a card", async () => {
      const store = mockStore(storeStateWith1Card);

      criteriaRedux.getCriteria = jest.fn((state, basic) => {
        return entity_test_criteria_basic;
      });
      await store.dispatch(setCriteriasTypology(criteriaType.DEV));

      expect(criteriaRedux.getCriteria.mock.calls.length).toBe(1);
      expect(criteriaRedux.getCriteria.mock.calls[0][1]).toEqual(
        criteriaType.DEV
      );
      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0]).toEqual(addCriteria_action);
      expect(actions[1]).toEqual({
        ...addCriteria_action,
        "payload.Criteria.Id": "2"
      });
    });

    test.skip("Start a card with empty parameter", () => {
      const wrapper = () => {
        store.dispatch(updateCardStatusForward());
      };

      expect(wrapper).toThrowError("Argument id is mandatory");
    });

    test.skip("Start a not existing card", async () => {
      const store = mockStore(storeStateWith1Card);

      /*cardsSelector.getCard = jest.fn(() => {
        return [];
      });*/

      await expect(
        store.dispatch(updateCardStatusForward("999"))
      ).rejects.toEqual(new Error("Card with id 999 can't be found"));

      //expect(cardsSelector.getCard.mock.calls.length).toBe(1);
    });

    test.skip("Start a card without criteria, expect error", async () => {
      const store = mockStore(storeStateWith1Card);

      await expect(
        store.dispatch(updateCardStatusForward("1"))
      ).rejects.toThrowError(
        "Can't change status of card 1 to INPROGRESS to a card without criteria"
      );
    });

    test.skip("Start a card with criterias, expect Status to INPROGRESS", async () => {
      const store = mockStore(
        storeStateDyn([entity_test_created_with_criterias])
      );

      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve({ update: true });
            }, 20);
          })
      );
      await store.dispatch(updateCardStatusForward("1"));

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toEqual(
        entity_test_created_with_criterias
      );

      expect(fnMockPostCards.mock.calls[0][1]).toEqual({
        Status: cardStatus.INPROGRESS
      });
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual(start_action);
    });
    test.skip("Toogle 1 Card Criteria without parameters", () => {
      const store = mockStore(storeStateInitial);
      let wrapper = () => {
        store.dispatch(toggleCardCriteria());
      };

      expect(wrapper).toThrowError(
        "Id Card, Id Criteria and Value Criteria arguments are mandatory"
      );

      wrapper = () => {
        store.dispatch(toggleCardCriteria("1"));
      };

      expect(wrapper).toThrowError(
        "Id Card, Id Criteria and Value Criteria arguments are mandatory"
      );

      wrapper = () => {
        store.dispatch(toggleCardCriteria("1", "3"));
      };

      expect(wrapper).toThrowError(
        "Id Card, Id Criteria and Value Criteria arguments are mandatory"
      );
    });

    test.skip("Toogle 1 Card Criteria not existing", async () => {
      const store = mockStore(storeStateInitial);

      await expect(
        store.dispatch(toggleCardCriteria("999", "1", true))
      ).rejects.toEqual(new Error("Card with id 999 can't be found"));
    });
    test.skip("Toogle 1 Card Criteria to true on card with 2 criterias set to false", async () => {
      const card = entity_test_created_with_criterias;
      const store = mockStore(storeStateDyn([card]));

      await store.dispatch(toggleCardCriteria("1", "1", true));
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual(setCardCriteria_action);

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toEqual(card);
      expect(fnMockPostCards.mock.calls[0][1]).toEqual({
        Id: "1",
        Value: true
      });
    });

    test.skip("retrieve all cards without type", () => {
      const wrapper = () => {
        const store = mockStore(storeStateInitial);
        store.dispatch(retrieveAllCards());
      };

      expect(wrapper).toThrowError("Argument type is mandatory");
    });
    test.skip("retrieve all cards of type TASK", async () => {
      fnMockGetCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve([entity_test_created]);
            }, 20);
          })
      );

      const store = mockStore(storeStateInitial);
      await store.dispatch(retrieveAllCards(cardType.Task));

      expect(fnMockGetCards.mock.calls.length).toBe(1);
      expect(fnMockGetCards.mock.calls[0][0]).toEqual(cardType.Task);

      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0]).toEqual(retrieve_start_action);
      expect(actions[1]).toEqual(retrieve_end_action);
    });

    test.skip("retrieve all cards of type TASK on existing state with cards", () => {
      const store = mockStore(storeStateWith1Card);
      const errorWrapper = () => {
        store.dispatch(retrieveAllCards(cardType.Task));
      };

      expect(errorWrapper).toThrowError(
        "Could not retrieve cards in the current state"
      );
    });
  });
});
/***
 *     █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
 *    ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
 *    ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
 *    ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
 *    ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
 *    ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
 *
 */

describe("Actions creators", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test.skip("create card success action", () => {
    const createAction = createCardSuccess("1", entity_test);
    expect(createAction).toEqual(create_action);
  });

  test("Add criteria to a card", () => {
    expect(
      addCriteria("1", { idCriteria: "critId1", defaultValue: "default" })
    ).toEqual(addCriteria_action);
  });

  test.skip("Start a card without Id", () => {
    const inner = () => {
      startCard();
    };

    expect(inner).toThrowError(new Error("Id arg is mandatory"));
  });
  test.skip("Start a card with an Id", () => {
    const startCardAction = startCard("1");

    expect(startCardAction).toEqual(start_action);
  });

  test.skip("Done a card without Id", () => {
    const inner = () => {
      doneCard();
    };

    expect(inner).toThrowError(new Error("Id arg is mandatory"));
  });

  test.skip("Done a card with an Id", () => {
    const doneCardAction = doneCard("1");

    expect(doneCardAction).toEqual(done_action);
  });

  test.skip("Set done criteria of a card", () => {
    const cardCriteriaAction = setCardCriteria("1", "1", true);

    expect(cardCriteriaAction).toEqual(setCardCriteria_action);
  });

  test.skip("Retrieve all cards - start", () => {
    expect(retrieveAllCards_Starting()).toEqual(retrieve_start_action);
  });
  test.skip("Retrieve all cards - end", () => {
    expect(retrieveAllCards_End([entity_test_created])).toEqual(
      retrieve_end_action
    );
  });
});

/***
 *    ██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗███████╗██████╗ ███████╗
 *    ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
 *    ██████╔╝█████╗  ██║  ██║██║   ██║██║     █████╗  ██████╔╝███████╗
 *    ██╔══██╗██╔══╝  ██║  ██║██║   ██║██║     ██╔══╝  ██╔══██╗╚════██║
 *    ██║  ██║███████╗██████╔╝╚██████╔╝╚██████╗███████╗██║  ██║███████║
 *    ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝
 *
 */
describe("reducers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test.skip("undefined", () => {
    expect(cardReducer(undefined, {})).toEqual({
      list: [],
      status: LOADING_STATE.NULL
    });
  });

  test.skip("CREATE on empty state", () => {
    expect(cardReducer(undefined, create_action)).toEqual({
      list: [entity_test_created],
      status: LOADING_STATE.NULL
    });
  });

  test.skip("CREATE on existing state", () => {
    expect(cardReducer(stateWith1Card, create_action)).toEqual({
      list: [entity_test_created, entity_test_created],
      status: LOADING_STATE.NULL
    });
  });

  test.skip("START action", () => {
    expect(cardReducer(stateWith1Card, start_action)).toEqual({
      list: [{ ...entity_test_created, Status: cardStatus.INPROGRESS }],
      status: LOADING_STATE.NULL
    });
  });

  test("ADD criteria", () => {
    expect(cardReducer(stateWith1Card, addCriteria_action)).toEqual({
      list: [
        {
          ...entity_test_created,
          Criterias: [{ Id: "critId1", Value: "default" }]
        }
      ],
      status: LOADING_STATE.NULL
    });
  });
  test.skip("SET CRITERIA action", () => {
    expect(
      cardReducer(
        stateWithDynCard({
          ...entity_test_created,
          ...entity_test_2criteria_false
        }),
        setCardCriteria_action
      )
    ).toEqual(
      stateWithDynCard({
        ...entity_test_created,
        Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: false }]
      })
    );
  });

  test.skip("SET CRITERIA action 2 ", () => {
    expect(
      cardReducer(
        stateWithDynCard({
          ...entity_test_created,
          Criterias: [{ Id: "1", Value: false }, { Id: "2", Value: true }]
        }),
        setCardCriteria_action
      )
    ).toEqual(
      stateWithDynCard({
        ...entity_test_created,
        Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: true }]
      })
    );
  });

  test.skip("DONE action", () => {
    expect(
      cardReducer(
        stateWithDynCard({
          ...entity_test_created
        }),
        done_action
      )
    ).toEqual(
      stateWithDynCard({ ...entity_test_created, Status: cardStatus.DONE })
    );
  });

  test.skip("RETRIEVE action start on empty state", () => {
    expect(cardReducer(undefined, retrieve_start_action)).toEqual({
      list: [],
      status: LOADING_STATE.INPROGRESS
    });
  });

  test.skip("RETRIEVE action end on empty state", () => {
    expect(cardReducer(undefined, retrieve_end_action)).toEqual({
      list: [entity_test_created],
      status: LOADING_STATE.DONE
    });
  });
});
/***
 *    ███████╗███████╗██╗     ███████╗ ██████╗████████╗ ██████╗ ██████╗ ███████╗
 *    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
 *    ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║   ██║██████╔╝███████╗
 *    ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║   ██║██╔══██╗╚════██║
 *    ███████║███████╗███████╗███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║███████║
 *    ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
 *
 */

describe("Selectors", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test.skip("GetAllCards no state arg", () => {
    const testgetAllCards = () => {
      getAllCards();
    };

    expect(testgetAllCards).toThrowError(new Error("State arg is mandatory"));
  });

  test.skip("GetAllCards from default state", () => {
    expect(getAllCards({})).toEqual([]);
  });

  test.skip("GetAllCards from state with 1 card", () => {
    expect(getAllCards(storeStateWith1Card)).toEqual([entity_test_created]);
  });

  test.skip("GetAllCards InProgress", () => {
    const cardIp = {
      Title: "test - inprogress",
      Status: cardStatus.INPROGRESS,
      Type: cardType.Task
    };

    expect(
      getAllCardsInProgess(storeStateDyn([entity_test_created, cardIp]))
    ).toEqual([cardIp]);
  });

  test.skip("GetAllCards Todo", () => {
    const cardIp = {
      Title: "test - inprogress",
      Status: cardStatus.INPROGRESS,
      Type: cardType.Task
    };

    expect(
      getAllCardsTodo(storeStateDyn([entity_test_created, cardIp]))
    ).toEqual([entity_test_created]);
  });

  test.skip("GetAllCards DONE", () => {
    const cardIp = {
      Title: "test - done",
      Status: cardStatus.DONE,
      Type: cardType.Task
    };

    expect(
      getAllCardsDone(storeStateDyn([entity_test_created, cardIp]))
    ).toEqual([
      {
        Title: "test - done",
        Status: cardStatus.DONE,
        Type: cardType.Task
      }
    ]);
  });

  test.skip("Get cards loading state", () => {
    expect(getLoadingStatus(storeStateWith1Card)).toEqual(LOADING_STATE.NULL);
  });

  test.skip("Get card by id", () => {
    expect(getCard(storeStateWith1Card, "1")).toEqual(entity_test_created);
  });

  test.skip("Get card by id, not exist, expect undefined", () => {
    expect(getCard(storeStateWith1Card, 99999)).toEqual(undefined);
  });
});
