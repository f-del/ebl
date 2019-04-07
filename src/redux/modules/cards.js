import update from "immutability-helper";

const CREATE = "CARD/CREATE";
const START = "CARD/START";

const RETRIEVE = "CARD/RETRIEVE/START";
const RETRIEVED = "CARD/RETRIEVE/END";

const card = title => ({
  Title: title,
  Status: cardStatus.TODO,
  Type: cardType.Task
});

export const LOADING_STATE = Object.freeze({
  INPROGRESS: Symbol("LOADING"),
  DONE: Symbol("LOADED"),
  NULL: Symbol("NULL"),
  ERROR: Symbol("ERROR")
});

export const cardStatus = Object.freeze({
  TODO: Symbol("TODO"),
  INPROGRESS: Symbol("INPROGRESS")
});

export const cardType = {
  Task: "TASK"
};

/***
 *     █████╗ ██████╗ ██╗
 *    ██╔══██╗██╔══██╗██║
 *    ███████║██████╔╝██║
 *    ██╔══██║██╔═══╝ ██║
 *    ██║  ██║██║     ██║
 *    ╚═╝  ╚═╝╚═╝     ╚═╝
 *
 */

export const createCard = title => {
  return (dispatch, getState, { api }) => {
    const newCard = card(title);
    return api.Cards.Post(newCard).then(res => {
      dispatch(createCardSuccess(res.Id, newCard));
    });
  };
};

export const retrieveAllCards = type => {
  return (dispatch, getState, { api }) => {
    if (getAllCards(getState()).length !== 0)
      throw new Error("Could not retrieve cards in the current state");

    if (getLoadingStatus(getState()) === LOADING_STATE.NULL) {
      dispatch(retrieveAllCards_Starting());

      return api.Cards.Get(type).then(res => {
        dispatch(retrieveAllCards_End(res));
      });
    }
  };
};

/***
 *     █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
 *    ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
 *    ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
 *    ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
 *    ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
 *    ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
 *
 */

export const createCardSuccess = (id, card) => ({
  type: CREATE,
  payload: { Id: id, ...card }
});

export const retrieveAllCards_Starting = type => {
  return {
    type: RETRIEVE,
    payload: {}
  };
};

export const retrieveAllCards_End = cards => {
  return {
    type: RETRIEVED,
    payload: {
      cards
    }
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

/***
 *    ██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗███████╗██████╗ ███████╗
 *    ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
 *    ██████╔╝█████╗  ██║  ██║██║   ██║██║     █████╗  ██████╔╝███████╗
 *    ██╔══██╗██╔══╝  ██║  ██║██║   ██║██║     ██╔══╝  ██╔══██╗╚════██║
 *    ██║  ██║███████╗██████╔╝╚██████╔╝╚██████╗███████╗██║  ██║███████║
 *    ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝
 *
 */

const initialState = {
  list: [],
  status: LOADING_STATE.NULL
};

export default function(state = initialState, action) {
  //console.debug(action);
  switch (action.type) {
    case RETRIEVE: {
      return { ...state, status: LOADING_STATE.INPROGRESS };
    }
    case RETRIEVED: {
      return {
        ...state,
        list: action.payload.cards,
        status: LOADING_STATE.DONE
      };
    }
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

/***
 *    ███████╗███████╗██╗     ███████╗ ██████╗████████╗ ██████╗ ██████╗ ███████╗
 *    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
 *    ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║   ██║██████╔╝███████╗
 *    ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║   ██║██╔══██╗╚════██║
 *    ███████║███████╗███████╗███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║███████║
 *    ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
 *
 */

export function getAllCards(state) {
  return getCards(validateState(state)).list || [];
}

export function getAllCardsInProgess(state) {
  return getAllCards(state).filter(isCardStatusInProgess);
}

export function getAllCardsTodo(state) {
  return getAllCards(state).filter(isCardStatusToDo);
}

export function getLoadingStatus(state) {
  return getCards(validateState(state)).status;
}

/* Functionnal helper */
function validateState(state) {
  if (state === undefined) throw new Error("State arg is mandatory");
  return state;
}
function getCards(state) {
  return state.cards || {};
}

function isCardStatusInProgess(card) {
  return card.Status === cardStatus.INPROGRESS;
}
function isCardStatusToDo(card) {
  return card.Status === cardStatus.TODO;
}
