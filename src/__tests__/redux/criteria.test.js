import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import criteriaReducer, { getCriteria } from "../../redux/modules/criterias";

const middlewares = [thunk.withExtraArgument({})];
const mockStore = configureMockStore(middlewares);

test("Expect inital state, on call to reducer", () => {
  expect(criteriaReducer(undefined, { type: "on-action" })).toEqual({
    list: {
      BASIC: {
        Id: "IdCritBas1",
        Value: "defaultBas"
      }
    }
  });
});

test("GetCriteria without param", () => {
  const wrapper = () => {
    getCriteria({}, undefined);
  };

  expect(wrapper).toThrowError("Type argument is mandatory");
});
