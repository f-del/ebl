import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "../redux/store/index";

import UiSelect from "@material-ui/core/Select";
import UiButton from "@material-ui/core/Button";
import UiMenuItem from "@material-ui/core/MenuItem";
import UiCheckbox from "@material-ui/core/Checkbox";
import * as cardsSelector from "../redux/modules/cards";
import { cardStatus } from "../redux/modules/cards";
import CardActions from "../components/CardActions";
import CardActionnable from "../containers/CardActionnable";
import {
  entity_test_created,
  entity_test_created_with_criterias
} from "./datas";
import {
  entity_criteria,
  entity_criteria_type,
  retMockGetCriteria
} from "./redux/criteria.test";
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
          entity_criteria_type(),
          entity_criteria_type("NOTEXT", entity_criteria)
        ]}
      />
    ).dive();

    expect(wrapper.find(UiButton).length).toBe(0);
    expect(wrapper.find(UiSelect).length).toBe(1);
    const listitem = wrapper.find(UiMenuItem);
    expect(listitem.length).toBe(2);

    expect(wrapper).toMatchSnapshot();

    wrapper.unmount();
  });

  test("Expect assert call onAction, on Select a Dod criteria", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = shallow(
      <CardActions
        card={entity_test_created}
        onAction={mockAction}
        criterias_typology_list={[
          entity_criteria_type(),
          entity_criteria_type("NOTEXT", entity_criteria)
        ]}
      />
    ).dive();
    const selectDod = wrapper.find(UiSelect);
    selectDod.simulate("change", { target: { value: "BASIC" } });
    expect(mockAction.mock.calls.length).toBe(1);
    const onActionArg = mockAction.mock.calls[0][0];
    expect(onActionArg).toBeDefined();
    expect(onActionArg).toStrictEqual({ value: "BASIC" });
    expect(wrapper).toMatchSnapshot();
  });

  test("Initial state in status TODO with criteria", () => {
    const mockAction = jest.fn(id => {});
    const wrapper = shallow(
      <CardActions
        card={entity_test_created_with_criterias}
        onAction={mockAction}
      />
    ).dive();

    const btnStart = wrapper.find(UiButton);
    btnStart.simulate("click");
    expect(btnStart.length).toBe(1);
    expect(mockAction.mock.calls.length).toBe(1);
    expect(mockAction.mock.calls[0][0]).not.toBeDefined();
    expect(wrapper).toMatchSnapshot();
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

    const checkboxes = wrapper.find(UiCheckbox);
    expect(checkboxes.length).toBeGreaterThan(0);

    const disabled = checkboxes.at(1).props().disabled;
    expect(disabled).toStrictEqual(true);
    expect(checkboxes.at(1).props().checked).toBeTruthy();

    expect(wrapper.find("button").length).toBe(0);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  test("Click checkbox on Status PROGRESS", () => {
    const mockAction = jest.fn(() => {});
    const wrapper = mount(
      <CardActions
        card={entity_card_created_on_progress}
        onAction={mockAction}
      />
    );

    const checkbox = wrapper.find(UiCheckbox);
    checkbox
      .at(0)
      .props()
      .onChange({ target: { checked: true } });

    expect(mockAction.mock.calls.length).toBe(1);
    expect(mockAction.mock.calls[0][0]).toStrictEqual(checkboxActionparams());
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  test("Click on all checkbox validate Status", () => {
    const mockAction = jest.fn(() => {});

    const wrapper = mount(
      <CardActions
        card={entity_card_created_on_progress}
        onAction={mockAction}
      />
    );

    const checkbox = wrapper.find(UiCheckbox);
    checkbox.forEach(c => c.props().onChange({ target: { checked: true } }));

    expect(mockAction.mock.calls.length).toBe(2);
    expect(mockAction.mock.calls[0][0]).toStrictEqual(checkboxActionparams());
    expect(mockAction.mock.calls[1][0]).toStrictEqual(
      checkboxActionparams("2")
    );

    entity_card_created_on_progress.Criterias[0].Value = true;
    entity_card_created_on_progress.Criterias[1].Value = true;
    wrapper.setProps({ card: entity_card_created_on_progress });
    const checkboxChecked = wrapper.find(UiCheckbox);
    checkboxChecked.forEach(ckb => {
      expect(ckb.props().disabled).toStrictEqual(true);
      expect(ckb.props().checked).toBeTruthy();
    });
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
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

    const selectDod = wrapper.find(UiSelect);
    selectDod
      .at(0)
      .props()
      .onChange({ target: { value: "BASIC" } });
    expect(cardsSelector.setCriteriasTypology.mock.calls.length).toBe(1);
    expect(cardsSelector.setCriteriasTypology.mock.calls[0][0]).toBe("1");
    expect(cardsSelector.setCriteriasTypology.mock.calls[0][1]).toBe(
      criteriaType.BASIC
    );
    expect(wrapper).toMatchSnapshot();
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
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  test("Call onAction with status INPROGRESS expect mock on toggleCardCriteria", () => {
    cardsSelector.toggleCardCriteria = jest.fn().mockImplementationOnce(id => {
      return dispatch => {
        return id;
      };
    });
    store = createStore(reducer, applyMiddleware(thunk));

    const wrapper = mount(
      <Provider store={store}>
        <CardActionnable
          card={{
            ...entity_test_created,
            Status: cardStatus.INPROGRESS,
            Criterias: [...retMockGetCriteria]
          }}
        />
        ,
      </Provider>
    );
    const checkbox = wrapper.find('input[type="checkbox"]');
    checkbox.forEach(c => c.simulate("change", { target: { checked: true } }));
    expect(cardsSelector.toggleCardCriteria.mock.calls.length).toBe(1);
    expect(cardsSelector.toggleCardCriteria.mock.calls[0][0]).toBe("1");
    expect(cardsSelector.toggleCardCriteria.mock.calls[0][1]).toBe(
      "IdCritBas1"
    );
    expect(cardsSelector.toggleCardCriteria.mock.calls[0][2]).toBe(true);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
});
