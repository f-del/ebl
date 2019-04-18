import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import uiReducer from "../../redux/modules/personas";
import { entity_test_created } from "../datas";
import { selectHypothesis } from "../../redux/modules/ui";

describe("Reducer", () => {
  test("Action select Hypothesis", () => {
    const hypothesis = { ...entity_test_created };

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
