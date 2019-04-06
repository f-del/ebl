const CREATE = "CARD/CREATE";
const START = "CARD/START";

const card = title => ({
  Title: title,
  Status: cardStatus.Todo,
  Type: cardType.Task
});

export const cardStatus = {
  Todo: "TODO"
};

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
      console.log("post done,  new Id =" + res.Id);
      dispatch(createCardSuccess(res.Id, newCard));
    });
  };
};

export const startCard = id => ({
  type: START,
  payload: {
    Id: id
  }
});

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  console.debug(action);
  switch (action.type) {
    case CREATE:
      return { ...state, list: [...state.list, action.payload] };
    default:
      return state;
  }
}

export function getAllCards(state) {
  console.debug(state);
  if (state === undefined) throw new Error("State arg is mandatory");
  return state.cards !== undefined ? state.cards.list : [];
}
