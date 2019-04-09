import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { cardStatus } from "../redux/modules/cards";
import CardActions from "../components/CardActions";

configure({ adapter: new Adapter() });

describe("Componant tests", () => {
  test("Initial state in status TODO", () => {
    const wrapper = shallow(
      <CardActions status={cardStatus.TODO} onAction={() => {}} />
    );

    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toBe("Start");
  });

  test("Initial state in status TODO", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions status={cardStatus.TODO} onAction={mockAction} />
    );

    const btnStart = wrapper.find("button");
    btnStart.simulate("click");
    expect(mockAction.mock.calls.length).toBe(1);
  });

  test("Initial state in status INPROGRESS", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = mount(
      <CardActions status={cardStatus.INPROGRESS} onAction={mockAction} />
    );

    expect(wrapper.find('input[type="checkbox"]').length).toBeGreaterThan(0);

    expect(wrapper.find("button").length).toBe(0);
  });

  test("Click checkbox on Status PROGRESS", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions status={cardStatus.INPROGRESS} onAction={mockAction} />
    );

    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.first().simulate("change", { target: { checked: true } });

    expect(mockAction.mock.calls.length).toBe(1);
    expect(mockAction.mock.calls[0][0]).toBe(true);
  });

  test("Click on all checkbox validate Status", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions status={cardStatus.INPROGRESS} onAction={mockAction} />
    );

    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.forEach(c => c.simulate("change", { target: { checked: true } }));

    expect(mockAction.mock.calls.length).toBe(2);
    expect(mockAction.mock.calls[0][0]).toBe(true);
    expect(mockAction.mock.calls[1][0]).toBe(true);
  });
});
