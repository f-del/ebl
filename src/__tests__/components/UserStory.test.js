import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../../redux/store/index";

import uiReducer from "../../redux/modules/ui";
import { entity_test_created } from "../datas";
import UserStorySelected from "../../containers/UserStorySelected";
import UserStory from "../../components/UserStory";
import { cardType } from "../../redux/modules/cards";
import CardsBoard from "../../containers/CardsBoard";

configure({ adapter: new Adapter() });
var store, api;

describe("Componant tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    api = {
      Cards: {
        Post: jest.fn(),
        Get: jest.fn()
      }
    };

    store = createStore(
      reducer,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );
  });

  test("Not already loaded UserStory", () => {
    const wrapper = shallow(<UserStory />);

    expect(wrapper.isEmptyRender()).toEqual(true);
  });

  test("UserStory setted externaly without attached Tasks", () => {
    const wrapper = shallow(
      <UserStory
        userStory={{ ...entity_test_created, Type: cardType.UserStory }}
      />
    );

    expect(wrapper.isEmptyRender()).toEqual(false);
    expect(
      wrapper
        .find(CardsBoard)
        .at(0)
        .props().type
    ).toStrictEqual(cardType.Task);
  });
});

describe("Containers tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store = createStore(
      reducer,
      applyMiddleware(thunk.withExtraArgument({ api }))
    );
  });
  test("Expect props onAction is defined", () => {
    uiReducer.getUserStorySelected = jest.fn().mockImplementationOnce(id => {
      return dispatch => {
        return entity_test_created;
      };
    });

    store = createStore(reducer, applyMiddleware(thunk));

    const wrapper = shallow(
      <Provider store={store}>
        <UserStorySelected />,
      </Provider>
    );

    expect(wrapper.props("userStory")).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
