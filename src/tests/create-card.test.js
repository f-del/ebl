import React from "react";
import thunk from "redux-thunk";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import configureMockStore from "redux-mock-store";

import {
  createCard,
  cardType,
  cardStatus,
  getAllCards,
  startCard,
  createCardSuccess
} from "../redux/modules/cards";
import reducer from "../redux/store/index";
import CreateCard from "../components/CreateCard";
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

configure({ adapter: new Adapter() });
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
    console.debug("getAllCards ");
    console.debug(store.getState());
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
  test("card a card", async () => {
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

    test("start card action", () => {
      const id = 1;
      const startAction = startCard(id);
      expect(startAction).toEqual(start_action);
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
  });

  describe("Componant tests", () => {
    function expectInitState(wrapper) {
      expect(wrapper.find("button").length).toBe(1);
      expect(wrapper.find("button").text()).toBe("Create new task");
      expect(wrapper.find("input").length).toBe(0);
    }

    test("Initial state", () => {
      const wrapper = shallow(<CreateCard />);

      console.log(wrapper.debug());
      expectInitState(wrapper);
      //expect(wrapper.state("mode")).toBe(1);

      wrapper.unmount();
    });

    test("Click on create new task and cancel by ESCAPE", () => {
      const wrapper = shallow(<CreateCard />);

      expectInitState(wrapper);
      expect(wrapper.find("button").simulate("click"));

      //expect(wrapper.state("mode")).toBe(2);
      expect(wrapper.find("button").length).toBe(0);

      const input = wrapper.find("textarea");

      expect(input.length).toBe(1);

      console.debug(wrapper);
      const text = "Unit test task";
      [...text].forEach((c, i) => {
        input.simulate("keyDown", { which: c.charCodeAt(0) });
      });

      input.simulate("keyDown", { which: 27 });

      expect(wrapper.find("button").length).toBe(1);
      //expect(wrapper.state("mode")).toBe(1);
      wrapper.unmount();
    });

    test("Click on create new task and validate by ENTER", () => {
      const wrapper = mount(<CreateCard />);

      const onValidate = jest.fn();
      const preventDefault = jest.fn();
      wrapper.setProps({ onValidate });

      expectInitState(wrapper);
      expect(wrapper.find("button").simulate("click"));

      expect(wrapper.find("button").length).toBe(0);

      const input = wrapper.find("textarea");
      expect(input.prop("autoFocus")).toBe(true);

      expect(input.length).toBe(1);
      // TODO : expect focus ?
      //expect(document.activeElement).toEqual(input.getDOMNode());
      console.debug(wrapper);
      const text = "Unit test task";
      // [...text].forEach((c, i) => {
      //   //input.simulate("keyDown", { which: c.charCodeAt(0) });
      // });
      input.simulate("change", { target: { value: text } });

      input.simulate("keyDown", { which: 13, preventDefault });
      expect(preventDefault.mock.calls.length).toBe(1);
      expect(onValidate.mock.calls.length).toBe(1);
      expect(onValidate.mock.calls[0][0]).toBe(text);
      expectInitState(wrapper);

      wrapper.unmount();
    });
  });
});
