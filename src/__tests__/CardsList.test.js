import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import CardListByStatus from "../containers/CardsListByStatus";

import { cardStatus } from "../redux/modules/cards";
import * as cardsSelector from "../redux/modules/cards";

configure({ adapter: new Adapter() });
let store;

describe("Containers tests", () => {
  describe("CardsListByStatus", () => {
    beforeEach(() => {
      store = configureMockStore();
      jest.resetAllMocks();
    });
    test("CardsListByStatus with bad symbol status parameter", () => {
      const falseStatus = Object.freeze({
        TODO: Symbol("FALSETODO")
      });
      const wrapper = () => {
        const wrapper = mount(
          <Provider store={store({})}>
            <CardListByStatus status={falseStatus.TODO} />
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

      const wrapper = mount(
        <Provider store={store({})}>
          <CardListByStatus status={cardStatus.TODO} />
        </Provider>
      );

      expect(cardsSelector.getAllCardsTodo.mock.calls.length).toBe(1);
      wrapper.unmount();
    });

    test("CardsListByStatus with Inprogress", () => {
      cardsSelector.getAllCardsInProgess = jest.fn(state => {
        return [];
      });

      const wrapper = mount(
        <Provider store={store({})}>
          <CardListByStatus status={cardStatus.INPROGRESS} />
        </Provider>
      );

      expect(cardsSelector.getAllCardsInProgess.mock.calls.length).toBe(1);
      wrapper.unmount();
    });

    test("CardsListByStatus with DONE", () => {
      cardsSelector.getAllCardsDone = jest.fn(state => {
        return [];
      });

      const wrapper = mount(
        <Provider store={store({})}>
          <CardListByStatus status={cardStatus.DONE} />
        </Provider>
      );

      expect(cardsSelector.getAllCardsDone.mock.calls.length).toBe(1);
      wrapper.unmount();
    });
  });
});

describe("Componant tests", () => {});
