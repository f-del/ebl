import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../../redux/store/index";

import UiTypography from "@material-ui/core/Typography";

import Hypothesis from "../../components/Hypothesis";
import { entity_hypothesis_attached } from "../datas";
import personnasReducer from "../../redux/modules/personas";
import uiReducer from "../../redux/modules/ui";
import HypothesisSelected from "../../containers/HypothesisSelected";
import { entity_persona_created } from "../redux/personas";

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

  test("Not already loaded hypothesis", () => {
    const wrapper = shallow(<Hypothesis />);

    expect(wrapper.isEmptyRender()).toEqual(true);
  });

  test("Display an hypothesis, props hypothesis setted externaly", () => {
    const hypothesis = entity_hypothesis_attached();
    const wrapper = shallow(<Hypothesis hypothesis={hypothesis} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(UiTypography).length).toBe(1);
  });
});

describe("Containers tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Expect props onAction is defined", () => {
    personnasReducer.getPersona = jest.fn().mockImplementationOnce(id => {
      return dispatch => {
        return entity_persona_created;
      };
    });
    uiReducer.getHypothesisSelected = jest.fn().mockImplementationOnce(id => {
      return dispatch => {
        return entity_persona_created;
      };
    });

    store = createStore(reducer, applyMiddleware(thunk));

    const wrapper = shallow(
      <Provider store={store}>
        <HypothesisSelected />,
      </Provider>
    );

    expect(wrapper.props("persona")).toBeDefined();
    expect(wrapper.props("hypothesis")).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });
});
