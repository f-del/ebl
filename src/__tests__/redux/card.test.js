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
  entity_test_created_with_criterias
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
  setCriteriasTypology,
  attachCards,
  addUserStoryToHypothesis
} from "../../redux/modules/cards";
import { criteriaType } from "../../redux/modules/criterias";
import * as criteriaRedux from "../../redux/modules/criterias";
import reducer from "../../redux/store/index";
import cardReducer from "../../redux/modules/cards";
import {
  retMockGetCriteriaWithText,
  entity_criteria_wtext,
  retMockGetCriteria,
  entity_criteria
} from "./criteria.test";
import { expect_post_create, expect_post_update } from "../API/cards.test";
import { entity_persona_created } from "./personas";

/*   Code to activate integrated test on DB
import firebase from "firebase/app";
import "firebase/firestore";
import { api } from "../../API/api";
let config = {
  apiKey: "AIzaSyBwM4YVUVijCR35f9D_vg1qHbF3OTotVb0",
  authDomain: "massive-pen-231814.firebaseapp.com",
  databaseURL: "https://massive-pen-231814.firebaseio.com",
  projectId: "massive-pen-231814",
  storageBucket: "massive-pen-231814.appspot.com",
  messagingSenderId: "61056570786"
};

if (firebase.apps.length === 0) firebase.initializeApp(config);
const db = firebase.firestore();
*/
const ____MOCK_API____ = true;
var api,
  db = undefined;

var middlewares = undefined;
var store,
  mockStore = undefined;
var fnMockPostCards,
  fnMockGetCards = undefined;

const create_action = {
  type: "CARD/CREATE",
  payload: {
    Id: "1",
    ...entity_test,
    CreatedAt: new Date(2000, 1, 1, 12, 0, 0, 0)
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

const addCriteria_action_text = {
  type: "CARD/CRITERIA/ADD",
  payload: { Id: "1", Criteria: entity_criteria_wtext() }
};

const addCriteria_action_notext = {
  type: "CARD/CRITERIA/ADD",
  payload: { Id: "1", Criteria: entity_criteria() }
};

const attach_action = {
  type: "CARD/ATTACH",
  payload: {
    IdParent: "IdParent",
    IdChild: "IdChild"
  }
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

    fnMockGetCards = jest.fn(() => {
      return new Promise((resolve, reject) => {
        setTimeout(t => {
          resolve([entity_test_created]);
        }, 100);
      });
    });
    if (____MOCK_API____) {
      api = {
        Cards: {
          Post: fnMockPostCards,
          Get: fnMockGetCards
        }
      };
    }
    middlewares = [thunk.withExtraArgument({ api })];
    mockStore = configureMockStore(middlewares);
    store = createStore(
      reducer,
      applyMiddleware(
        thunk.withExtraArgument(____MOCK_API____ ? { api } : { api: api(db) })
      )
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

  test("Toogle 1 Card Criteria to true on card with 1 criterias set to true", async () => {
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

    expect(fnMockPostCards.mock.calls.length).toBe(2);
    expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual(card);
    expect(fnMockPostCards.mock.calls[0][1]).toStrictEqual({
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: true }]
    });

    expect(fnMockPostCards.mock.calls[1][0]).toStrictEqual({
      ...entity_test_created,
      Status: cardStatus.INPROGRESS,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: true }]
    });
    expect(fnMockPostCards.mock.calls[1][1]).toStrictEqual({
      Status: cardStatus.DONE
    });

    expect(getCard(store.getState(), "1")).toStrictEqual({
      ...entity_test_created,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: true }],
      Status: cardStatus.DONE
    });
  });

  test("Expect that toggle to false an already truthy criteria is blocked", async () => {
    const initialStore = storeStateDyn([entity_test_created_with_criterias]);

    store = createStore(
      reducer,
      initialStore,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );

    await store.dispatch(toggleCardCriteria("1", "1", true));
    expect(getCard(store.getState(), "1")).toStrictEqual({
      ...entity_test_created,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: false }],
      Status: cardStatus.TODO
    });

    await store.dispatch(toggleCardCriteria("1", "1", false));

    expect(getCard(store.getState(), "1")).toStrictEqual({
      ...entity_test_created,
      Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: false }],
      Status: cardStatus.TODO
    });
  });

  describe("Unit tests", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test("create a card without title", () => {
      const wrapper = () => {
        const store = mockStore(storeStateInitial);
        store.dispatch(createCard());
      };
      expect(wrapper).toThrowError("Argument title is mandatory");
    });

    test("create a card incorrect card Type arg", () => {
      const wrapper = () => {
        const store = mockStore(storeStateInitial);
        store.dispatch(createCard("1", { persona: { Id: "dsqd" } }));
      };
      expect(wrapper).toThrowError(
        "Optionnal argument type is not correct, should be come from cardType enum"
      );
    });

    test("create a card with persona malformed", async () => {
      const store = mockStore(storeStateInitial);
      await expect(
        store.dispatch(
          createCard("1", cardType.Hypothesis, { persona: { Id: "dsqd" } })
        )
      ).rejects.toThrowError(
        "Optionnal argument persona is not correct, should be {persona : {id, needsIndex}}"
      );
    });

    test("create a card", async () => {
      const store = mockStore(storeStateInitial);

      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve(expect_post_create("10"));
            }, 20);
          })
      );

      await store.dispatch(createCard("test"));

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual({
        ...entity_test,
        CreatedAt: expect.any(Date)
      });
      const actions = store.getActions();
      expect(actions.length).toBe(1);

      expect(actions[0]).toStrictEqual({
        type: "CARD/CREATE",
        payload: {
          Id: "10",
          Title: "test",
          Status: cardStatus.TODO,
          Type: cardType.Task,
          CreatedAt: expect.any(Date)
        }
      });
    });

    test("create a card : Hypothesis", async () => {
      const store = mockStore(storeStateInitial);

      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve(expect_post_create("10"));
            }, 20);
          })
      );

      const persona = entity_persona_created;
      await store.dispatch(
        createCard("test", cardType.Hypothesis, {
          persona: {
            id: persona.Id,
            needsIndex: 3
          }
        })
      );

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toEqual({
        ...entity_test,
        CreatedAt: expect.any(Date),
        Type: cardType.Hypothesis,
        Persona: {
          Id: persona.Id,
          NeedsIndex: 3
        }
      });
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual({
        type: "CARD/CREATE",
        payload: {
          ...entity_test,
          CreatedAt: expect.any(Date),
          Id: "10",
          Status: cardStatus.TODO,
          Type: cardType.Hypothesis,
          Persona: {
            Id: persona.Id,
            NeedsIndex: 3
          }
        }
      });
    });

    function _isUndefined(fn, argName) {
      return () => {
        const wrapper = () => {
          fn();
        };
        expect(wrapper).toThrowError("Argument " + argName + " is mandatory");
      };
    }

    async function testSetCriteriaTypology_basic(type = undefined) {
      const store = mockStore(storeStateWith1Card);
      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve(expect_post_update());
            }, 20);
          })
      );
      criteriaRedux.getCriteria = jest
        .fn()
        .mockImplementationOnce((state, basic) => {
          return retMockGetCriteria;
        });
      await store.dispatch(setCriteriasTypology("1", type));
      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual(
        entity_test_created
      );
      expect(fnMockPostCards.mock.calls[0][1]).toStrictEqual({
        Criterias: retMockGetCriteria
      });
      expect(criteriaRedux.getCriteria.mock.calls.length).toBe(1);
      expect(criteriaRedux.getCriteria.mock.calls[0][1]).toStrictEqual(
        criteriaType.BASIC
      );
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toStrictEqual(addCriteria_action_notext);
    }

    test("Add a user story to an not existing Hypothesis card", async () => {
      await expect(
        store.dispatch(
          addUserStoryToHypothesis("999", "test title user story card")
        )
      ).rejects.toThrowError("Card with id 999 can't be found");
    });

    test("Add a user story to an Hypothesis card", async () => {
      const text = "test title user story card";
      const store = mockStore(storeStateWith1Card);
      fnMockPostCards
        .mockImplementationOnce(
          () =>
            new Promise((resolve, reject) => {
              setTimeout(t => {
                resolve(expect_post_create("IdChild"));
              }, 20);
            })
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve, reject) => {
              setTimeout(t => {
                resolve(expect_post_update());
              }, 20);
            })
        );
      await store.dispatch(addUserStoryToHypothesis("1", text));

      expect(fnMockPostCards.mock.calls.length).toBe(2);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual({
        Title: text,
        CreatedAt: expect.any(Date),
        Type: cardType.UserStory,
        Status: cardStatus.TODO
      });

      expect(fnMockPostCards.mock.calls[1][0]).toStrictEqual(
        entity_test_created
      );
      expect(fnMockPostCards.mock.calls[1][1]).toStrictEqual({
        UserStories: [{ Id: "IdChild" }]
      });
      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0]).toStrictEqual({
        ...create_action,
        payload: {
          ...create_action.payload,
          Id: "IdChild",
          Title: text,
          Type: cardType.UserStory,
          CreatedAt: expect.any(Date)
        }
      });

      expect(actions[1]).toStrictEqual({
        ...attach_action,
        payload: { ...attach_action.payload, IdParent: "1" }
      });
    });

    test(
      "Affect a BASIC Dod Criterias typology to a card (no parameter)",
      _isUndefined(setCriteriasTypology, "id")
    );

    test("Affect a BASIC Dod Criterias typology to a card with already criterias set", async () => {
      const store = mockStore(
        storeStateDyn([entity_test_created_with_criterias])
      );

      await expect(
        store.dispatch(setCriteriasTypology("1"))
      ).rejects.toThrowError("Card 1 has already criterias attached");
    });

    test("Affect a BASIC Dod Criterias typology on a non existing card", async () => {
      const store = mockStore(storeStateWith1Card);

      await expect(
        store.dispatch(setCriteriasTypology("999"))
      ).rejects.toThrowError("Card with id 999 can't be found");
    });

    test("Affect a BASIC Dod Criterias typology to a card (no parameter)", async () => {
      await testSetCriteriaTypology_basic();
    });
    test("Affect a BASIC Dod Criterias typology to a card", async () => {
      await testSetCriteriaTypology_basic(criteriaType.BASIC);
    });

    test("Affect a DEV Dod Criterias typology to a card", async () => {
      const store = mockStore(storeStateWith1Card);
      const entity_criterias_dev = [
        ...retMockGetCriteriaWithText,
        entity_criteria_wtext("IdCritBas2", "defaultBas2", "TextCrit2")
      ];
      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve(expect_post_update());
            }, 20);
          })
      );

      criteriaRedux.getCriteria = jest
        .fn()
        .mockImplementationOnce((state, basic) => {
          return entity_criterias_dev;
        });

      await store.dispatch(setCriteriasTypology("1", criteriaType.DEV));
      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual(
        entity_test_created
      );
      expect(fnMockPostCards.mock.calls[0][1]).toStrictEqual({
        Criterias: entity_criterias_dev
      });

      expect(criteriaRedux.getCriteria.mock.calls.length).toBe(1);
      expect(criteriaRedux.getCriteria.mock.calls[0][1]).toStrictEqual(
        criteriaType.DEV
      );
      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0]).toStrictEqual(addCriteria_action_text);

      expect(actions[1]).toStrictEqual({
        payload: {
          Id: "1",
          Criteria: entity_criteria_wtext(
            "IdCritBas2",
            "defaultBas2",
            "TextCrit2"
          )
        },
        type: "CARD/CRITERIA/ADD"
      });
    });

    test("Start a card with empty parameter", () => {
      const wrapper = () => {
        store.dispatch(updateCardStatusForward());
      };

      expect(wrapper).toThrowError("Argument id is mandatory");
    });

    test("Start a not existing card", async () => {
      const store = mockStore(storeStateWith1Card);

      /*cardsSelector.getCard = jest.fn(() => {
        return [];
      });*/

      await expect(
        store.dispatch(updateCardStatusForward("999"))
      ).rejects.toStrictEqual(new Error("Card with id 999 can't be found"));

      //expect(cardsSelector.getCard.mock.calls.length).toBe(1);
    });

    test("Start a card without criteria, expect error", async () => {
      const store = mockStore(storeStateWith1Card);

      await expect(
        store.dispatch(updateCardStatusForward("1"))
      ).rejects.toThrowError(
        "Can't change status of card 1 to INPROGRESS to a card without criteria"
      );
    });

    test("Start a card with criterias, expect Status to INPROGRESS", async () => {
      const store = mockStore(
        storeStateDyn([entity_test_created_with_criterias])
      );

      fnMockPostCards.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            setTimeout(t => {
              resolve(expect_post_update());
            }, 20);
          })
      );
      await store.dispatch(updateCardStatusForward("1"));

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual(
        entity_test_created_with_criterias
      );

      expect(fnMockPostCards.mock.calls[0][1]).toStrictEqual({
        Status: cardStatus.INPROGRESS
      });
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toStrictEqual(start_action);
    });

    test("Toogle 1 Card Criteria without parameters", () => {
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

    test("Toogle 1 Card Criteria not existing", async () => {
      const store = mockStore(storeStateInitial);

      await expect(
        store.dispatch(toggleCardCriteria("999", "1", true))
      ).rejects.toStrictEqual(new Error("Card with id 999 can't be found"));
    });

    test("Toogle 1 Card Criteria without text to true", async () => {
      const card = {
        ...entity_test_created,
        Criterias: [
          {
            ...entity_criteria("1", false)
          }
        ]
      };
      const store = mockStore(storeStateDyn([card]));

      await store.dispatch(toggleCardCriteria("1", "1", true));
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toStrictEqual(setCardCriteria_action);

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual(card);
      expect(fnMockPostCards.mock.calls[0][1]).toStrictEqual({
        Criterias: [
          {
            Id: "1",
            Value: true
          }
        ]
      });
    });

    test("Toogle 1 Card Criteria to true on card with 2 criterias set to false", async () => {
      const card = entity_test_created_with_criterias;
      const store = mockStore(storeStateDyn([card]));

      await store.dispatch(toggleCardCriteria("1", "1", true));
      const actions = store.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0]).toStrictEqual(setCardCriteria_action);

      expect(fnMockPostCards.mock.calls.length).toBe(1);
      expect(fnMockPostCards.mock.calls[0][0]).toStrictEqual(card);
      expect(fnMockPostCards.mock.calls[0][1]).toStrictEqual({
        Criterias: [
          {
            Id: "1",
            Value: true
          },
          {
            Id: "2",
            Value: false
          }
        ]
      });
    });

    test("retrieve all cards without type", () => {
      const wrapper = () => {
        const store = mockStore(storeStateInitial);
        store.dispatch(retrieveAllCards());
      };

      expect(wrapper).toThrowError("Argument type is mandatory");
    });
    test("retrieve all cards of type TASK", async () => {
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
      expect(fnMockGetCards.mock.calls[0][0]).toStrictEqual(cardType.Task);

      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0]).toStrictEqual(retrieve_start_action);
      expect(actions[1]).toStrictEqual(retrieve_end_action);
    });

    test("retrieve all cards of type TASK on existing state with cards", async () => {
      const store = mockStore(storeStateWith1Card);

      await expect(
        store.dispatch(retrieveAllCards(cardType.Task))
      ).rejects.toThrowError("Could not retrieve cards in the current state");
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
  test("create card success action", () => {
    const createAction = createCardSuccess("1", entity_test);
    expect(createAction).toStrictEqual(create_action);
  });

  test("Attach card to another card, hierarchy mode", () => {
    const attachAction = attachCards("IdParent", "IdChild");
    expect(attachAction).toEqual(attach_action);
  });

  test("Add criteria with text to a card", () => {
    expect(addCriteria("1", entity_criteria_wtext())).toStrictEqual(
      addCriteria_action_text
    );
  });

  test("Add criteria without text to a card", () => {
    expect(addCriteria("1", entity_criteria())).toStrictEqual(
      addCriteria_action_notext
    );
  });

  test("Start a card without Id", () => {
    const inner = () => {
      startCard();
    };

    expect(inner).toThrowError(new Error("Id arg is mandatory"));
  });
  test("Start a card with an Id", () => {
    const startCardAction = startCard("1");

    expect(startCardAction).toStrictEqual(start_action);
  });

  test("Done a card without Id", () => {
    const inner = () => {
      doneCard();
    };

    expect(inner).toThrowError(new Error("Id arg is mandatory"));
  });

  test("Done a card with an Id", () => {
    const doneCardAction = doneCard("1");

    expect(doneCardAction).toStrictEqual(done_action);
  });

  test("Set done criteria of a card", () => {
    const cardCriteriaAction = setCardCriteria("1", "1", true);

    expect(cardCriteriaAction).toStrictEqual(setCardCriteria_action);
  });

  test("Retrieve all cards - start", () => {
    expect(retrieveAllCards_Starting()).toStrictEqual(retrieve_start_action);
  });
  test("Retrieve all cards - end", () => {
    expect(retrieveAllCards_End([entity_test_created])).toStrictEqual(
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
  test("undefined", () => {
    expect(cardReducer(undefined, {})).toStrictEqual({
      list: [],
      status: LOADING_STATE.NULL
    });
  });

  test("CREATE on empty state", () => {
    expect(cardReducer(undefined, create_action)).toStrictEqual({
      list: [{ ...entity_test_created, CreatedAt: expect.any(Date) }],
      status: LOADING_STATE.NULL
    });
  });

  test("CREATE on existing state", () => {
    expect(cardReducer(stateWith1Card, create_action)).toStrictEqual({
      list: [
        { ...entity_test_created, CreatedAt: expect.any(Date) },
        { ...entity_test_created, CreatedAt: expect.any(Date) }
      ],
      status: LOADING_STATE.NULL
    });
  });

  test("START action", () => {
    expect(cardReducer(stateWith1Card, start_action)).toStrictEqual({
      list: [
        {
          ...entity_test_created,
          Status: cardStatus.INPROGRESS,
          CreatedAt: expect.any(Date)
        }
      ],
      status: LOADING_STATE.NULL
    });
  });

  test("ATTACH action", () => {
    expect(
      cardReducer(
        stateWithDynCard([
          { ...entity_test_created, Id: "IdParent" },
          {
            ...entity_test_created,
            Id: "IdChild"
          }
        ]),
        attach_action
      )
    ).toEqual({
      list: [
        { ...entity_test_created, Id: "IdParent", Stories: ["IdChild"] },
        {
          ...entity_test_created,
          Id: "IdChild",
          Hypothesis: ["IdParent"]
        }
      ],
      status: LOADING_STATE.NULL
    });
  });

  test("ADD criteria", () => {
    expect(cardReducer(stateWith1Card, addCriteria_action_text)).toStrictEqual({
      list: [
        {
          ...entity_test_created,
          Criterias: [entity_criteria_wtext()]
        }
      ],
      status: LOADING_STATE.NULL
    });
  });
  test("SET CRITERIA action", () => {
    expect(
      cardReducer(
        stateWithDynCard([
          {
            ...entity_test_created,
            ...entity_test_2criteria_false
          }
        ]),
        setCardCriteria_action
      )
    ).toStrictEqual(
      stateWithDynCard([
        {
          ...entity_test_created,
          Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: false }]
        }
      ])
    );
  });

  test("SET CRITERIA action 2 ", () => {
    expect(
      cardReducer(
        stateWithDynCard([
          {
            ...entity_test_created,
            Criterias: [{ Id: "1", Value: false }, { Id: "2", Value: true }]
          }
        ]),
        setCardCriteria_action
      )
    ).toStrictEqual(
      stateWithDynCard([
        {
          ...entity_test_created,
          Criterias: [{ Id: "1", Value: true }, { Id: "2", Value: true }]
        }
      ])
    );
  });

  test("DONE action", () => {
    expect(
      cardReducer(
        stateWithDynCard([
          {
            ...entity_test_created
          }
        ]),
        done_action
      )
    ).toStrictEqual(
      stateWithDynCard([{ ...entity_test_created, Status: cardStatus.DONE }])
    );
  });

  test("RETRIEVE action start on empty state", () => {
    expect(cardReducer(undefined, retrieve_start_action)).toStrictEqual({
      list: [],
      status: LOADING_STATE.INPROGRESS
    });
  });

  test("RETRIEVE action end on empty state", () => {
    expect(cardReducer(undefined, retrieve_end_action)).toStrictEqual({
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
  test("GetAllCards no state arg", () => {
    const testgetAllCards = () => {
      getAllCards();
    };

    expect(testgetAllCards).toThrowError(new Error("State arg is mandatory"));
  });

  test("GetAllCards from default state", () => {
    expect(getAllCards({})).toStrictEqual([]);
  });

  test("GetAllCards from state with 1 card", () => {
    expect(getAllCards(storeStateWith1Card)).toStrictEqual([
      entity_test_created
    ]);
  });

  test("GetAllCards InProgress", () => {
    const cardIp = {
      Title: "test - inprogress",
      Status: cardStatus.INPROGRESS,
      Type: cardType.Task
    };

    expect(
      getAllCardsInProgess(storeStateDyn([entity_test_created, cardIp]))
    ).toStrictEqual([cardIp]);
  });

  test("GetAllCards Todo", () => {
    const cardIp = {
      Title: "test - inprogress",
      Status: cardStatus.INPROGRESS,
      Type: cardType.Task
    };

    expect(
      getAllCardsTodo(storeStateDyn([entity_test_created, cardIp]))
    ).toStrictEqual([entity_test_created]);
  });

  test("GetAllCards DONE", () => {
    const cardIp = {
      Title: "test - done",
      Status: cardStatus.DONE,
      Type: cardType.Task
    };

    expect(
      getAllCardsDone(storeStateDyn([entity_test_created, cardIp]))
    ).toStrictEqual([
      {
        Title: "test - done",
        Status: cardStatus.DONE,
        Type: cardType.Task
      }
    ]);
  });

  test("Get cards loading state", () => {
    expect(getLoadingStatus(storeStateWith1Card)).toStrictEqual(
      LOADING_STATE.NULL
    );
  });

  test("Get card by id", () => {
    expect(getCard(storeStateWith1Card, "1")).toStrictEqual(
      entity_test_created
    );
  });

  test("Get card by id, not exist, expect undefined", () => {
    expect(getCard(storeStateWith1Card, 99999)).toStrictEqual(undefined);
  });
});
