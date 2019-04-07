import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";

import {
  createCard,
  cardType,
  cardStatus,
  getAllCards,
  startCard,
  createCardSuccess,
  getAllCardsInProgess,
  getAllCardsTodo,
  retrieveAllCards,
  retrieveAllCards_Starting,
  retrieveAllCards_End,
  LOADING_STATE,
  getLoadingStatus
} from "../redux/modules/cards";
import reducer from "../redux/store/index";
import cardReducer from "../redux/modules/cards";
import { createStore, applyMiddleware } from "redux";

// import { api } from "../API/api";
// jest.mock("../API/api", () => {
//   return {
//     Cards: {
//       Post: jest.fn(() => {
//         return new Promise((resolve, reject) => {
//           // use firestore API
//           setTimeout(t => {
//             resolve({ Id: 1 });
//           }, 100);
//         });
//       })
//     }
//   };
// });

var middlewares = undefined;
var store,
  mockStore = undefined;
var fnMockPostCards,
  fnMockGetCards = undefined;
var api = undefined;
/*    DATAS  */
const entity_test = {
  Title: "test",
  Status: cardStatus.TODO,
  Type: cardType.Task
};
const entity_test_created = { Id: 1, ...entity_test };

const create_action = {
  type: "CARD/CREATE",
  payload: {
    Id: 1,
    ...entity_test
  }
};
const start_action = {
  type: "CARD/START",
  payload: {
    Id: 1
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

const stateWith1Card = {
  list: [entity_test_created],
  status: LOADING_STATE.NULL
};
const storeStateInitial = {
  cards: { list: [], status: LOADING_STATE.NULL }
};
const storeStateWith1Card = {
  cards: { list: [entity_test_created], status: LOADING_STATE.NULL }
};
const storeStateDyn = card => {
  return {
    cards: { list: [entity_test_created, card], status: LOADING_STATE.NULL }
  };
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
  test("call action createcard & expect change in state with getAllCards selector", async () => {
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

  test("call action createcard then call action startcard & expect getAllCardsInProgess selector", async () => {
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

  test("call action getAllCards and expect to retrieve cards in state", async () => {
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

  test("retrieve all cards in // calls, expect only 1 call on API Get", async done => {
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

  describe("Unit tests", () => {
    test("create a card", async () => {
      const store = mockStore(storeStateInitial);

      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve({ Id: 10 });
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
          Id: 10,
          Title: "test",
          Status: cardStatus.TODO,
          Type: cardType.Task
        }
      });
    });

    test("retrieve all cards of type TASK", async () => {
      const store = mockStore(storeStateInitial);
      await store.dispatch(retrieveAllCards(cardType.Task));

      expect(fnMockGetCards.mock.calls.length).toBe(1);
      expect(fnMockGetCards.mock.calls[0][0]).toEqual(cardType.Task);

      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0]).toEqual(retrieve_start_action);
      expect(actions[1]).toEqual(retrieve_end_action);
    });

    test("retrieve all cards of type TASK on existing state with cards", () => {
      const store = mockStore(storeStateWith1Card);
      const errorWrapper = () => {
        store.dispatch(retrieveAllCards(cardType.Task));
      };

      expect(errorWrapper).toThrowError(
        "Could not retrieve cards in the current state"
      );
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
    test("create card success action", () => {
      const createAction = createCardSuccess(1, entity_test);
      expect(createAction).toEqual(create_action);
    });

    it("Start a card without Id", () => {
      const inner = () => {
        startCard();
      };

      expect(inner).toThrowError(new Error("Id arg is mandatory"));
    });
    it("Start a card with an Id", () => {
      const startCardAction = startCard(1);

      expect(startCardAction).toEqual(start_action);
    });

    it("Retrieve all cards - start", () => {
      expect(retrieveAllCards_Starting()).toEqual(retrieve_start_action);
    });
    it("Retrieve all cards - end", () => {
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
    test("undefined", () => {
      expect(cardReducer(undefined, {})).toEqual({
        list: [],
        status: LOADING_STATE.NULL
      });
    });

    test("CREATE on empty state", () => {
      expect(cardReducer(undefined, create_action)).toEqual({
        list: [entity_test_created],
        status: LOADING_STATE.NULL
      });
    });

    test("CREATE on existing state", () => {
      expect(cardReducer(stateWith1Card, create_action)).toEqual({
        list: [entity_test_created, entity_test_created],
        status: LOADING_STATE.NULL
      });
    });

    test("START action", () => {
      expect(cardReducer(stateWith1Card, start_action)).toEqual({
        list: [{ ...entity_test_created, Status: cardStatus.INPROGRESS }],
        status: LOADING_STATE.NULL
      });
    });

    test("RETRIEVE action start on empty state", () => {
      expect(cardReducer(undefined, retrieve_start_action)).toEqual({
        list: [],
        status: LOADING_STATE.INPROGRESS
      });
    });

    test("RETRIEVE action end on empty state", () => {
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
    test("GetAllCards no state arg", () => {
      const testgetAllCards = () => {
        getAllCards();
      };

      expect(testgetAllCards).toThrowError(new Error("State arg is mandatory"));
    });

    test("GetAllCards from default state", () => {
      expect(getAllCards({})).toEqual([]);
    });

    test("GetAllCards from state with 1 card", () => {
      expect(getAllCards(storeStateWith1Card)).toEqual([entity_test_created]);
    });

    test("GetAllCards InProgress", () => {
      const cardIp = {
        Title: "test - inprogress",
        Status: cardStatus.INPROGRESS,
        Type: cardType.Task
      };

      expect(getAllCardsInProgess(storeStateDyn(cardIp))).toEqual([cardIp]);
    });

    test("GetAllCards Todo", () => {
      const cardIp = {
        Title: "test - inprogress",
        Status: cardStatus.INPROGRESS,
        Type: cardType.Task
      };

      expect(getAllCardsTodo(storeStateDyn(cardIp))).toEqual([
        entity_test_created
      ]);
    });

    test("Get cards loading state", () => {
      expect(getLoadingStatus(storeStateWith1Card)).toEqual(LOADING_STATE.NULL);
    });
  });
});
