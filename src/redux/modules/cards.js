import update from "immutability-helper";

const CREATE = "CARD/CREATE";
const START = "CARD/START";

const card = title => ({
  Title: title,
  Status: cardStatus.TODO,
  Type: cardType.Task
});

export const cardStatus = Object.freeze({
  TODO: Symbol("TODO"),
  INPROGRESS: Symbol("INPROGRESS")
});

export const cardType = {
  Task: "TASK"
};

export const createCardSuccess = (id, card) => ({
  type: CREATE,
  payload: { Id: id, ...card }
});

export const createCard = title => {
  return (dispatch, getState, { api }) => {
    const newCard = card(title);
    return api.Tasks.Post(newCard).then(res => {
      dispatch(createCardSuccess(res.Id, newCard));
    });
  };
};

export const startCard = id => {
  if (id === undefined) throw new Error("Id arg is mandatory");
  return {
    type: START,
    payload: {
      Id: id
    }
  };
};

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  //console.debug(action);
  switch (action.type) {
    case CREATE:
      return { ...state, list: [...state.list, action.payload] };
    case START:
      let idx = state.list.findIndex(c => c.Id === action.payload.Id);

      var mergeObject = {};
      mergeObject[idx] = { $merge: { Status: cardStatus.INPROGRESS } };

      return { ...state, list: update(state.list, mergeObject) };

    default:
      return state;
  }
}

export function getAllCards(state) {
  if (state === undefined) throw new Error("State arg is mandatory");
  return state.cards !== undefined ? state.cards.list : [];
}

export function getAllCardsInProgess(state) {
  return getAllCards(state).filter(isCardStatusInProgess);
}
export function getAllCardsTodo(state) {
  return getAllCards(state).filter(isCardStatusToDo);
}

/* Functionnal helper */
function isCardStatusInProgess(card) {
  return card.Status === cardStatus.INPROGRESS;
}
function isCardStatusToDo(card) {
  return card.Status === cardStatus.TODO;
}
