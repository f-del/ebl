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
import {
  entity_test_created,
  entity_test_created_with_criterias
} from "./datas";
import { entity_storecriteria_basic } from "./redux/criteria.test";
import { criteriaType } from "../redux/modules/criterias";

configure({ adapter: new Adapter() });
let store;

const checkboxActionparams = (id = "1", value = true) => ({ id, value });
const entity_card_created_on_progress = {
  ...entity_test_created_with_criterias,
  Status: cardStatus.INPROGRESS
};
describe("Componant tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Initial state in status TODO, without Criterias", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions
        card={entity_test_created}
        onAction={mockAction}
        criterias_typology_list={[
          entity_storecriteria_basic,
          { ...entity_storecriteria_basic, Text: "TEST" }
        ]}
      />
    );

    expect(wrapper.find("button").length).toBe(0);
    expect(wrapper.find("select").length).toBe(1);
    expect(wrapper.find("select>option").length).toBe(3);
    expect(
      wrapper
        .find("select>option")
        .at(0)
        .text()
    ).toBe("Affect a DoD to task");
    expect(
      wrapper
        .find("select>option")
        .at(1)
        .text()
    ).toBe("BASIC");
    expect(
      wrapper
        .find("select>option")
        .at(1)
        .props().value
    ).toEqual("BASIC");
    expect(
      wrapper
        .find("select>option")
        .at(2)
        .text()
    ).toBe("TEST");
    expect(mockAction.mock.calls.length).toBe(0);
  });

  test("Expect assert call onAction, on Select a Dod criteria", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions
        card={entity_test_created}
        onAction={mockAction}
        criterias_typology_list={[
          entity_storecriteria_basic,
          { ...entity_storecriteria_basic, Text: "TEST" }
        ]}
      />
    );
    const selectDod = wrapper.find("select");
    selectDod.simulate("change", { target: { value: "BASIC" } });
    expect(mockAction.mock.calls.length).toBe(1);
    const onActionArg = mockAction.mock.calls[0][0];
    expect(onActionArg).toBeDefined();
    expect(onActionArg).toEqual({ value: "BASIC" });
  });

  test("Initial state in status TODO with criteria", () => {
    const mockAction = jest.fn(id => {});
    const wrapper = shallow(
      <CardActions
        card={entity_test_created_with_criterias}
        onAction={mockAction}
      />
    );

    const btnStart = wrapper.find("button");
    btnStart.simulate("click");
    expect(wrapper.find("button").length).toBe(1);
    expect(wrapper.find("button").text()).toBe("Start");
    expect(mockAction.mock.calls.length).toBe(1);
    expect(mockAction.mock.calls[0][0]).not.toBeDefined();
  });

  test("Initial state in status INPROGRESS", () => {
    const mockAction = jest.fn(() => {});

    entity_card_created_on_progress.Criterias[1].Value = true;
    const wrapper = mount(
      <CardActions
        card={entity_card_created_on_progress}
        onAction={mockAction}
      />
    );

    expect(wrapper.find('input[type="checkbox"]').length).toBeGreaterThan(0);
    expect(
      wrapper
        .find('input[type="checkbox"]')
        .at(1)
        .props().readonly
    ).toBeTruthy();
    expect(
      wrapper
        .find('input[type="checkbox"]')
        .at(1)
        .props().checked
    ).toBeTruthy();

    expect(wrapper.find("button").length).toBe(0);
  });

  test("Click checkbox on Status PROGRESS", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions
        card={entity_card_created_on_progress}
        onAction={mockAction}
      />
    );

    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.first().simulate("change", { target: { checked: true } });

    expect(mockAction.mock.calls.length).toBe(1);
    expect(mockAction.mock.calls[0][0]).toEqual(checkboxActionparams());
  });

  test("Click on all checkbox validate Status", () => {
    const mockAction = jest.fn(() => {});

    const wrapper = shallow(
      <CardActions
        card={entity_card_created_on_progress}
        onAction={mockAction}
      />
    );

    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.forEach(c => c.simulate("change", { target: { checked: true } }));

    expect(mockAction.mock.calls.length).toBe(2);
    expect(mockAction.mock.calls[0][0]).toEqual(checkboxActionparams());
    expect(mockAction.mock.calls[1][0]).toEqual(checkboxActionparams("2"));

    // Checkbox are readonly after a
    const updatedCheckbox = wrapper.find('input[type="checkbox"]');
    updatedCheckbox.forEach(ckb => expect(ckb.props().readonly).toBeTruthy());
  });
});

describe("Containers tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Expect props onAction is defined", () => {
    const wrapper = shallow(
      <CardActionnable
        card={entity_test_created_with_criterias}
        status={cardStatus.TODO}
      />
    );

    expect(wrapper.props("onAction")).toBeDefined();
  });
  test("Call onAction with status TODO and no criteria expect mock on setCriteriasTypology", () => {
    cardsSelector.setCriteriasTypology = jest
      .fn()
      .mockImplementationOnce(id => {
        return dispatch => {
          return id;
        };
      });

    store = createStore(reducer, applyMiddleware(thunk));

    const wrapper = mount(
      <Provider store={store}>
        <CardActionnable card={entity_test_created} />,
      </Provider>
    );

    const selectDod = wrapper.find("select");
    selectDod.simulate("change", { target: { value: "BASIC" } });
    expect(cardsSelector.setCriteriasTypology.mock.calls.length).toBe(1);
    expect(cardsSelector.setCriteriasTypology.mock.calls[0][0]).toBe("1");
    expect(cardsSelector.setCriteriasTypology.mock.calls[0][1]).toBe(
      criteriaType.BASIC
    );
    wrapper.unmount();
  });

  test("Call onAction with status TODO expect mock on startCard", () => {
    cardsSelector.updateCardStatusForward = jest
      .fn()
      .mockImplementationOnce(id => {
        return dispatch => {
          return id;
        };
      });
    store = createStore(reducer, applyMiddleware(thunk));

    const wrapper = mount(
      <Provider store={store}>
        <CardActionnable card={entity_test_created_with_criterias} />,
      </Provider>
    );
    const btnStart = wrapper.find("button");
    btnStart.simulate("click");
    expect(cardsSelector.updateCardStatusForward.mock.calls.length).toBe(1);
    expect(cardsSelector.updateCardStatusForward.mock.calls[0][0]).toBe("1");
    wrapper.unmount();
  });

  // test.todo(
  //   "Call onAction with status INPROGRESS expect mock on toggleCardCriteria"
  // );
});
