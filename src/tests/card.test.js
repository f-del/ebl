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
  getAllCardsTodo
} from "../redux/modules/cards";
import reducer from "../redux/store/index";
import cardReducer from "../redux/modules/cards";
import { createStore, applyMiddleware } from "redux";

// import { api } from "../API/api";
// jest.mock("../API/api", () => {
//   return {
//     Tasks: {
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

// const setHookState = (newState = {}) =>
//   jest
//     .fn()
//     .mockImplementation((state = {}) => [newState, (newState = {}) => {}]);

var middlewares = undefined;
var mockStore = undefined;
var fnMockPostTasks = undefined;
var api = undefined;
/*    DATAS  */
const entity_test = {
  Title: "test",
  Status: cardStatus.Todo,
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

const stateWith1Card = {
  list: [entity_test_created]
};
const storeStateInitial = {
  cards: { list: [] }
};
const storeStateWith1Card = {
  cards: { list: [entity_test_created] }
};
const storeStateDyn = card => {
  return {
    cards: { list: [entity_test_created, card] }
  };
};

describe("Integration tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    fnMockPostTasks = jest.fn(() => {
      return new Promise((resolve, reject) => {
        // use firestore API
        setTimeout(t => {
          resolve({ Id: -9999 });
        }, 100);
      });
    });
    api = {
      Tasks: {
        Post: fnMockPostTasks
      }
    };
  });
  test("call action createcard & expect change in state with getAllCards selector", async () => {
    // call action create card
    // on async success
    // get updated state
    // call start action on retrieved card id
    // get refreshed card entity from state
    // expect it's state === INPROGRESS
    fnMockPostTasks.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(t => {
            resolve({ Id: 555 });
          }, 20);
        })
    );
    const store = createStore(
      reducer,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );
    await store.dispatch(createCard("test"));
    expect(getAllCards(store.getState()).length).toBe(1);
  });
});

describe("Unit tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    fnMockPostTasks = jest.fn(() => {
      return new Promise((resolve, reject) => {
        // use firestore API
        setTimeout(t => {
          resolve({ Id: -9999 });
        }, 100);
      });
    });
    api = {
      Tasks: {
        Post: fnMockPostTasks
      }
    };
    middlewares = [thunk.withExtraArgument({ api })];
    mockStore = configureMockStore(middlewares);
  });
  test("create a card", async () => {
    const store = mockStore(storeStateInitial);

    fnMockPostTasks.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(t => {
            resolve({ Id: 10 });
          }, 20);
        })
    );

    await store.dispatch(createCard("test"));

    expect(fnMockPostTasks.mock.calls.length).toBe(1);
    expect(fnMockPostTasks.mock.calls[0][0]).toEqual(entity_test);
    const actions = store.getActions();
    expect(actions.length).toBe(1);
    expect(actions[0]).toEqual({
      type: "CARD/CREATE",
      payload: {
        Id: 10,
        Title: "test",
        Status: "TODO",
        Type: cardType.Task
      }
    });
  });

  describe("Actions functions factory", () => {
    test("create card success action", () => {
      const createAction = createCardSuccess(1, entity_test);
      expect(createAction).toEqual(create_action);
    });

    // test("created card action", () => {
    //   const createdAction = createdCard(entity_test);
    //   expect(createAction).toEqual(create_action);
    // });

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
  });

  describe("reducers", () => {
    test("cardreducer undefined", () => {
      expect(cardReducer(undefined, {})).toEqual({ list: [] });
    });

    test("cardreducer CREATE on empty state", () => {
      expect(cardReducer(undefined, create_action)).toEqual({
        list: [entity_test_created]
      });
    });

    test("cardreducer CREATE on existing state", () => {
      expect(cardReducer(stateWith1Card, create_action)).toEqual({
        list: [entity_test_created, entity_test_created]
      });
    });

    test("cardreducer on start action", () => {
      expect(cardReducer(stateWith1Card, start_action)).toEqual({
        list: [{ ...entity_test_created, Status: "INPROGRESS" }]
      });
    });
  });

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
        Status: cardStatus.Inprogress,
        Type: cardType.Task
      };

      expect(getAllCardsInProgess(storeStateDyn(cardIp))).toEqual([cardIp]);
    });

    test("GetAllCards Todo", () => {
      const cardIp = {
        Title: "test - inprogress",
        Status: cardStatus.Inprogress,
        Type: cardType.Task
      };

      expect(getAllCardsTodo(storeStateDyn(cardIp))).toEqual([
        entity_test_created
      ]);
    });
  });
});
