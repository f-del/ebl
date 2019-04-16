import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Provider } from "react-redux";

import reducer from "../redux/store/index";
import * as cardsSelector from "../redux/modules/cards";
import CardsBoard from "../containers/CardsBoard";

configure({ adapter: new Adapter() });
let store;

beforeEach(() => {
  jest.resetAllMocks();
  store = createStore(reducer, applyMiddleware(thunk));
});
test("CardsListByStatus with todo", () => {
  cardsSelector.retrieveAllCards = jest.fn(type => {
    return dispatch => {
      return [];
    };
  });

  const wrapper = mount(
    <Provider store={store}>
      <CardsBoard />
    </Provider>
  );

  expect(cardsSelector.retrieveAllCards.mock.calls.length).toBe(1);
  expect(cardsSelector.retrieveAllCards.mock.calls[0][0]).toStrictEqual(
    cardsSelector.cardType.Task
  );
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});