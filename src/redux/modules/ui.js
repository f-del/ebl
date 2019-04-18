const SELECT_HYPOTHESIS = "UI/SELECT/HYPOTHESIS";

export const selectHypothesis = hypothesis => ({
  type: SELECT_HYPOTHESIS,
  payload: {
    Id: hypothesis.Id
  }
});
const initialState = {
  currentHypothesis: undefined
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_HYPOTHESIS: {
      return { ...state, currentHypothesis: action.payload.Id };
    }
    default:
      return state;
  }
}

export function getHypothesisSelected(state) {
  return state.ui.currentHypothesis;
}
