const SELECT_HYPOTHESIS = "UI/SELECT/HYPOTHESIS";

export const selectHypothesis = hypothesis => ({
  type: SELECT_HYPOTHESIS,
  payload: {
    Id: hypothesis.Id,
    PersonaId: hypothesis.Persona.Id,
    PersonaNeedsIdx: hypothesis.Persona.NeedsIndex
  }
});

export default function uiReducer(state = {}, action) {
  return state;
}
