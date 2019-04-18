import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import CardListByStatus from "../containers/CardsListByStatus";

import { cardStatus } from "../redux/modules/cards";
import * as cardsSelector from "../redux/modules/cards";

configure({ adapter: new Adapter() });
let mockStore;

describe("Containers tests", () => {
  describe("CardsListByStatus", () => {
    beforeEach(() => {
      mockStore = configureMockStore();
      jest.resetAllMocks();
    });
    test("CardsListByStatus with bad symbol status parameter", () => {
      const falseStatus = Object.freeze({
        TODO: Symbol("FALSETODO")
      });
      const store = mockStore({});
      const wrapper = () => {
        const wrapper = mount(
          <Provider store={store}>
            <CardListByStatus status={falseStatus.TODO} type={"sdsd"} />
          </Provider>
        );
        wrapper.unmount();
      };
      expect(wrapper).toThrowError(
        "Status not recognized, should come from cardStatus"
      );
    });

    test("CardsListByStatus with todo", () => {
      cardsSelector.getAllCardsTodo = jest.fn(state => {
        return [];
      });
      const store = mockStore({});
      const wrapper = mount(
        <Provider store={store}>
          <CardListByStatus
            status={cardStatus.TODO}
            type={cardsSelector.cardType.Hypothesis}
          />
        </Provider>
      );

      expect(cardsSelector.getAllCardsTodo.mock.calls.length).toBe(1);
      expect(cardsSelector.getAllCardsTodo.mock.calls[0][1]).toStrictEqual({
        type: cardsSelector.cardType.Hypothesis
      });
      expect(wrapper).toMatchSnapshot();
      wrapper.unmount();
    });

    test("CardsListByStatus with Inprogress", () => {
      cardsSelector.getAllCardsInProgess = jest.fn(state => {
        return [];
      });

      const store = mockStore({});
      const wrapper = mount(
        <Provider store={store}>
          <CardListByStatus
            status={cardStatus.INPROGRESS}
            type={cardsSelector.cardType.UserStory}
          />
        </Provider>
      );

      expect(cardsSelector.getAllCardsInProgess.mock.calls.length).toBe(1);
      expect(cardsSelector.getAllCardsInProgess.mock.calls[0][0]).toStrictEqual(
        store.getState()
      );
      expect(cardsSelector.getAllCardsInProgess.mock.calls[0][1]).toStrictEqual(
        { type: cardsSelector.cardType.UserStory }
      );
      expect(wrapper).toMatchSnapshot();
      wrapper.unmount();
    });

    test("CardsListByStatus with DONE", () => {
      cardsSelector.getAllCardsDone = jest.fn(state => {
        return [];
      });

      const store = mockStore({});
      const wrapper = mount(
        <Provider store={store}>
          <CardListByStatus
            status={cardStatus.DONE}
            type={cardsSelector.cardType.Task}
            filterBy={{ persona: "1", needsIndex: 2 }}
          />
        </Provider>
      );

      expect(cardsSelector.getAllCardsDone.mock.calls.length).toBe(1);
      expect(cardsSelector.getAllCardsDone.mock.calls[0][1]).toStrictEqual({
        type: cardsSelector.cardType.Task,
        persona: "1",
        needsIndex: 2
      });
      expect(wrapper).toMatchSnapshot();
      wrapper.unmount();
    });
  });
});

describe("Componant tests", () => {});
