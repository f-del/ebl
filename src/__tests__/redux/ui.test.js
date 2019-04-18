import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import uiReducer from "../../redux/modules/ui";
import { entity_hypothesis_attached } from "../datas";
import { selectHypothesis } from "../../redux/modules/ui";

describe("Reducer", () => {
  test("Action select Hypothesis", () => {
    const hypothesis = entity_hypothesis_attached("1");

    expect(selectHypothesis(hypothesis)).toEqual({
      type: "UI/SELECT/HYPOTHESIS",
      payload: {
        Id: hypothesis.Id,
        PersonaId: hypothesis.Persona.Id,
        PersonaNeedsIdx: hypothesis.Persona.NeedsIndex
      }
    });
  });

  test("Should get Initial Static State", () => {
    expect(uiReducer(undefined, { type: "fakeaction" })).toStrictEqual({});
  });
});
