const SELECT_HYPOTHESIS = "UI/SELECT/HYPOTHESIS";
const SELECT_USERSTORY = "UI/SELECT/USER-STORY";

export const selectHypothesis = hypothesis => ({
  type: SELECT_HYPOTHESIS,
  payload: {
    Id: hypothesis.Id
  }
});

export const selectUserStory = userstory => ({
  type: SELECT_USERSTORY,
  payload: {
    Id: userstory.Id
  }
});

const initialState = {
  currentHypothesis: undefined,
  currentUserStory: undefined
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_HYPOTHESIS: {
      // currently Reducer handle Ui logic -> deselect current US on Hypothesis change
      return {
        ...state,
        currentHypothesis: action.payload.Id,
        currentUserStory: undefined
      };
    }
    case SELECT_USERSTORY: {
      return { ...state, currentUserStory: action.payload.Id };
    }

    default:
      return state;
  }
}

export function getHypothesisSelected(state) {
  return state.ui.currentHypothesis;
}
export function getUserStorySelected(state) {
  return state.ui.currentUserStory;
}
