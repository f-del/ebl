import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import uiReducer, {
  getHypothesisSelected,
  selectUserStory,
  getUserStorySelected
} from "../../redux/modules/ui";
import { entity_hypothesis_attached, entity_test_created } from "../datas";
import { selectHypothesis } from "../../redux/modules/ui";

const hypothesis = { ...entity_hypothesis_attached("Idpersona"), Id: "1" };
const userStory = { ...entity_test_created, Id: "6" };

const select_hypothesis_action = {
  type: "UI/SELECT/HYPOTHESIS",
  payload: {
    Id: "1"
  }
};
const select_userstory_action = {
  type: "UI/SELECT/USER-STORY",
  payload: { Id: "6" }
};
const ui_state_hypothesis_selected = {
  currentHypothesis: hypothesis.Id
};
const ui_state_userstory_selected = {
  currentUserStory: userStory.Id
};
export const store_ui_selected = state => ({
  ui: state
});

describe("Reducer", () => {
  test("Action select Hypothesis", () => {
    expect(selectHypothesis(hypothesis)).toEqual(select_hypothesis_action);
  });

  test("Action select User Story", () => {
    expect(selectUserStory(userStory)).toEqual(select_userstory_action);
  });

  test("Should get Initial Static State", () => {
    expect(uiReducer(undefined, { type: "fakeaction" })).toStrictEqual({
      currentHypothesis: undefined,
      currentUserStory: undefined
    });
  });

  test("Should get State after action selectHypothesis", () => {
    expect(uiReducer(undefined, select_hypothesis_action)).toStrictEqual({
      ...ui_state_hypothesis_selected,
      currentUserStory: undefined
    });
  });

  test("Should get State after action selectUserStory", () => {
    expect(uiReducer(undefined, select_userstory_action)).toStrictEqual({
      ...ui_state_userstory_selected,
      currentHypothesis: undefined
    });
  });

  test("Hypothesis selected", () => {
    expect(
      getHypothesisSelected(store_ui_selected(ui_state_hypothesis_selected))
    ).toStrictEqual(hypothesis.Id);
  });

  test("User Story selected", () => {
    expect(
      getUserStorySelected(store_ui_selected(ui_state_userstory_selected))
    ).toStrictEqual(userStory.Id);
  });
});
