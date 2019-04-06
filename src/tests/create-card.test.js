import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import CreateCard from "../components/CreateCard";

configure({ adapter: new Adapter() });

const onValidate = jest.fn();

describe("Componant tests", () => {
  function expectInitState(wrapper) {
    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toBe("Create new task");
    expect(wrapper.find("input").length).toBe(0);
  }

  test("Initial state", () => {
    const wrapper = shallow(<CreateCard onValidate={onValidate} />);

    expectInitState(wrapper);
    //expect(wrapper.state("mode")).toBe(1);

    wrapper.unmount();
  });

  test("Click on create new task and cancel by ESCAPE", () => {
    const wrapper = shallow(<CreateCard onValidate={onValidate} />);

    expectInitState(wrapper);
    expect(wrapper.find("button").simulate("click"));

    //expect(wrapper.state("mode")).toBe(2);
    expect(wrapper.find("button").length).toBe(0);

    const input = wrapper.find("textarea");

    expect(input.length).toBe(1);

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
    const wrapper = mount(<CreateCard onValidate={onValidate} />);

    const preventDefault = jest.fn();
    //wrapper.setProps({ onValidate });

    expectInitState(wrapper);
    expect(wrapper.find("button").simulate("click"));

    expect(wrapper.find("button").length).toBe(0);

    const input = wrapper.find("textarea");
    expect(input.prop("autoFocus")).toBe(true);

    expect(input.length).toBe(1);
    // TODO : expect focus ?
    //expect(document.activeElement).toEqual(input.getDOMNode());

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
