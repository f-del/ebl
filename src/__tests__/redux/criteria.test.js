import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import criteriaReducer, {
  getCriteria,
  criteriaType,
  getAllCriterias
} from "../../redux/modules/criterias";

const middlewares = [thunk.withExtraArgument({})];
const mockStore = configureMockStore(middlewares);

export const entity_criteria_basic = {
  Id: "IdCritBas1",
  Value: "defaultBas"
};
export const entity_storecriteria_basic = {
  BASIC: [entity_criteria_basic]
};
const stateWith1Criteria = {
  list: entity_storecriteria_basic
};
const storeStateInitial = {
  criterias: stateWith1Criteria
};
test("Expect inital state, on call to reducer", () => {
  expect(criteriaReducer(undefined, { type: "on-action" })).toEqual({
    list: {
      BASIC: [
        {
          Id: "IdCritBas1",
          Value: false
        }
      ],
      DEV: [
        {
          Id: "IdCritDev1",
          Text: "Development",
          Value: false
        },
        {
          Id: "IdCritDev2",
          Text: "Unit testing",
          Value: false
        }
      ]
    }
  });
});

test("GetCriteria without param", () => {
  const wrapper = () => {
    getCriteria({}, undefined);
  };

  expect(wrapper).toThrowError("Type argument is mandatory");
});

test("GetCriteria NOTSUPPORTED", () => {
  expect(getCriteria(storeStateInitial, "criteriaType.NOTSUPPORTED")).toEqual(
    []
  );
});

export const retMockGetCriteriaBASIC = [entity_criteria_basic];
test("GetCriteria BASIC", () => {
  expect(getCriteria(storeStateInitial, criteriaType.BASIC)).toEqual(
    retMockGetCriteriaBASIC
  );
});
test("Get All Criterias", () => {
  expect(getAllCriterias(storeStateInitial)).toEqual([
    entity_storecriteria_basic
  ]);
});
