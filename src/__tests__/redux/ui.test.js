import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import uiReducer, { getHypothesisSelected } from "../../redux/modules/ui";
import { entity_hypothesis_attached } from "../datas";
import { selectHypothesis } from "../../redux/modules/ui";

const hypothesis = { ...entity_hypothesis_attached("Idpersona"), Id: "1" };

const select_hypothesis_action = {
  type: "UI/SELECT/HYPOTHESIS",
  payload: {
    Id: "1"
  }
};
const ui_state_hypothesis_selected = {
  currentHypothesis: hypothesis.Id
};
export const store_ui_hypothesis_selected = {
  ui: ui_state_hypothesis_selected
};

describe("Reducer", () => {
  test("Action select Hypothesis", () => {
    expect(selectHypothesis(hypothesis)).toEqual(select_hypothesis_action);
  });

  test("Should get Initial Static State", () => {
    expect(uiReducer(undefined, { type: "fakeaction" })).toStrictEqual({
      currentHypothesis: undefined
    });
  });

  test("Should get State after action selectHypothesis", () => {
    expect(uiReducer(undefined, select_hypothesis_action)).toStrictEqual(
      ui_state_hypothesis_selected
    );
  });

  test("Hypothesis selected", () => {
    expect(getHypothesisSelected(store_ui_hypothesis_selected)).toStrictEqual(
      hypothesis.Id
    );
  });
});
