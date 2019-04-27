import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../../redux/store/index";
import * as uiRedux from "../../redux/modules/ui";
import {
  entity_hypothesis_attached,
  entity_test_created_with_criterias
} from "../datas";
import UiCard from "@material-ui/core/Card";
import CardSelectable from "../../components/CardSelectable";
import { cardType } from "../../redux/modules/cards";

configure({ adapter: new Adapter() });
var store, api;

describe("Containers tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    api = {
      Cards: {
        Post: jest.fn(),
        Get: jest.fn()
      }
    };
  });

  test("Expect ui.selectHypothesis on Card click", () => {
    uiRedux.selectHypothesis = jest
      .fn()
      .mockImplementationOnce(card => ({ type: "" }));

    store = createStore(
      reducer,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );
    const wrapper = mount(
      <Provider store={store}>
        <CardSelectable card={entity_hypothesis_attached()} />
      </Provider>
    );
    expect(wrapper.props("onSelect")).toBeDefined();

    const card = wrapper.find(UiCard);
    expect(card.length).toBe(1);
    card
      .at(0)
      .props()
      .onClick();
    expect(uiRedux.selectHypothesis.mock.calls.length).toBe(1);
    expect(uiRedux.selectHypothesis.mock.calls[0][0]).toStrictEqual(
      entity_hypothesis_attached()
    );
  });

  test("Expect ui.selectUserStory on Card click", () => {
    uiRedux.selectUserStory = jest
      .fn()
      .mockImplementationOnce(card => ({ type: "" }));

    store = createStore(
      reducer,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );
    const entity = {
      ...entity_test_created_with_criterias,
      Type: cardType.UserStory
    };
    const wrapper = mount(
      <Provider store={store}>
        <CardSelectable card={entity} />
      </Provider>
    );
    expect(wrapper.props("onSelect")).toBeDefined();

    const card = wrapper.find(UiCard);
    expect(card.length).toBe(1);
    card
      .at(0)
      .props()
      .onClick();
    expect(uiRedux.selectUserStory.mock.calls.length).toBe(1);
    expect(uiRedux.selectUserStory.mock.calls[0][0]).toStrictEqual(entity);
  });
});
