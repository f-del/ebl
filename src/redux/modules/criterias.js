export const criteriaType = {
  BASIC: "BASIC",
  DEV: "DEV"
};

export function create(id, value) {
  return { Id: id, Value: value };
}

const initialState = {
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
};

export default function(state = initialState, action) {
  return state;
}

export function getCriteria(state, type) {
  if (type === undefined) throw new Error("Type argument is mandatory");
  return getState(state).list[type] || [];
}
function getState(state) {
  return state.criterias || {};
}
