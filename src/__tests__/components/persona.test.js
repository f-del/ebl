import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { entity_persona_created } from "../redux/personas";
import Persona from "../../components/Persona";
import CreateCard from "../../components/CreateCard";
import CreateUserStoryCard from "../../containers/CreateUserStoryCard";

configure({ adapter: new Adapter() });

describe("Componant tests", () => {
  test("Display a persona without children", () => {
    const wrapper = shallow(<Persona persona={entity_persona_created} />);

    expect(wrapper.text()).toContain(entity_persona_created.Name);

    const needsList = wrapper.find("li");
    expect(needsList.length).toBe(entity_persona_created.Needs.length);
    expect(needsList.at(0).text()).toContain(entity_persona_created.Needs[0]);
  });

  test("Display a persona with children", () => {
    const wrapper = shallow(
      <Persona
        persona={entity_persona_created}
        addStory={CreateUserStoryCard}
      />
    );

    expect(wrapper.text()).toContain(entity_persona_created.Name);

    const needsList = wrapper.find("li");
    expect(needsList.length).toBe(entity_persona_created.Needs.length);
    expect(needsList.at(0).text()).toContain(entity_persona_created.Needs[0]);
  });
});
