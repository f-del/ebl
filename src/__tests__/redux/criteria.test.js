import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import criteriaReducer, {
  getCriteria,
  criteriaType,
  getAllCriterias
} from "../../redux/modules/criterias";

const middlewares = [thunk.withExtraArgument({})];
const mockStore = configureMockStore(middlewares);

export const entity_criteria_wtext = (
  id = "IdCritBas1",
  value = "defaultBas",
  text = "Criteria Title"
) => ({
  Id: id,
  Value: value,
  Text: text
});

export const entity_criteria = (id = "IdCritBas1", value = "defaultBas") => ({
  Id: id,
  Value: value
});

export const entity_criteria_type = (
  type = "BASIC",
  criteriaDodList = entity_criteria_wtext()
) => ({
  [type]: [criteriaDodList]
});
export const retMockGetCriteria = [entity_criteria()];
export const retMockGetCriteriaWithText = [entity_criteria_wtext()];
const getAllCriteriasMockReturn = [entity_criteria_type()];
const criteriasStore = (criteriaList = entity_criteria_type()) => ({
  list: criteriaList
});
const globalStore = (criterias = criteriasStore()) => ({
  criterias: criterias
});
test("Expect inital state, on call to reducer", () => {
  expect(criteriaReducer(undefined, { type: "on-action" })).toStrictEqual({
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
  expect(getCriteria(globalStore(), "criteriaType.NOTSUPPORTED")).toStrictEqual(
    []
  );
});

test("GetCriteria With Text", () => {
  expect(getCriteria(globalStore(), criteriaType.BASIC)).toStrictEqual(
    retMockGetCriteriaWithText
  );
});

test("GetCriteria Without Text", () => {
  expect(
    getCriteria(
      globalStore(
        criteriasStore(entity_criteria_type(undefined, entity_criteria()))
      ),
      criteriaType.BASIC
    )
  ).toStrictEqual(retMockGetCriteria);
});
test("Get All Criterias", () => {
  expect(getAllCriterias(globalStore())).toStrictEqual(
    getAllCriteriasMockReturn
  );
});
