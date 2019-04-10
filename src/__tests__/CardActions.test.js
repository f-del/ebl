import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import reducer from "../redux/store/index";
import * as cardsSelector from "../redux/modules/cards";
import { cardStatus } from "../redux/modules/cards";
import CardActions from "../components/CardActions";
import CardActionnable from "../containers/CardActionnable";

configure({ adapter: new Adapter() });
let store;

const checkboxActionparams = (id = "1", value = true) => ({ id, value });
describe("Componant tests", () => {
  test("Initial state in status TODO", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions status={cardStatus.TODO} onAction={mockAction} />
    );

    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toBe("Start");
    expect(mockAction.mock.calls.length).toBe(0);
  });

  test.skip("Initial state in status TODO", () => {
    const mockAction = jest.fn(id => {});
    const wrapper = shallow(
      <CardActions status={cardStatus.TODO} onAction={mockAction} />
    );

    const btnStart = wrapper.find("button");
    btnStart.simulate("click");
    expect(mockAction.mock.calls.length).toBe(1);
    expect(mockAction.mock.calls[0][0]).toBe(1);
  });

  test.skip("Initial state in status INPROGRESS", () => {
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
    expect(mockAction.mock.calls[0][0]).toEqual(checkboxActionparams());
  });

  test("Click on all checkbox validate Status", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions status={cardStatus.INPROGRESS} onAction={mockAction} />
    );

    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.forEach(c => c.simulate("change", { target: { checked: true } }));

    expect(mockAction.mock.calls.length).toBe(2);
    expect(mockAction.mock.calls[0][0]).toEqual(checkboxActionparams());
    expect(mockAction.mock.calls[1][0]).toEqual(checkboxActionparams("2"));

    const updatedCheckbox = wrapper.find('input[type="checkbox"]');
    updatedCheckbox.first().simulate("change", { target: { checked: false } });
    expect(mockAction.mock.calls[2][0]).toEqual(
      checkboxActionparams("1", false)
    );
  });
});

describe("Containers tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Expect props onAction is defined", () => {
    const wrapper = shallow(
      <CardActionnable id={1} status={cardStatus.TODO} />
    );

    expect(wrapper.props("onAction")).toBeDefined();
  });
  test.skip("Call onAction with status TODO expect mock on startCard", () => {
    cardsSelector.startCard = jest.fn(id => {
      return dispatch => {
        return id;
      };
    });

    store = createStore(reducer, applyMiddleware(thunk));

    const wrapper = mount(
      <Provider store={store}>
        <CardActionnable id={1} status={cardStatus.TODO} />,
      </Provider>
    );

    const btnStart = wrapper.find("button");
    btnStart.simulate("click");
    expect(cardsSelector.startCard.calls.length).toBe(1);
    expect(cardsSelector.startCard.calls[0][0]).toBe("1");
    wrapper.unmount();
  });
  test(
    "Call onAction with status INPROGRESS expect mock on toggleCardCriteria"
  );
});
