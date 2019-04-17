import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { entity_persona_created } from "../redux/personas";
import Persona from "../../components/Persona";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../../redux/store/index";

configure({ adapter: new Adapter() });
var store;
describe("Componant tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store = createStore(reducer, applyMiddleware(thunk));
  });

  test.skip("Display a persona without children", () => {
    const wrapper = shallow(
      <Persona persona={entity_persona_created} addStory={false} />
    );

    expect(wrapper.text()).toContain(entity_persona_created.Name);

    const needsList = wrapper.find("li");
    expect(needsList.length).toBe(entity_persona_created.Needs.length);
    expect(needsList.at(0).text()).toContain(entity_persona_created.Needs[0]);
    expect(wrapper.find("button").length).toBe(0);
  });

  test.skip("Display a persona with children", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Persona persona={entity_persona_created} addStory={true} />
      </Provider>
    );

    expect(wrapper.text()).toContain(entity_persona_created.Name);

    const needsList = wrapper.find("li");
    expect(needsList.length).toBe(entity_persona_created.Needs.length);
    expect(needsList.at(0).text()).toContain(entity_persona_created.Needs[0]);

    expect(wrapper.find("button").length).toBe(4);

    wrapper.unmount();
  });
});
