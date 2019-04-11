import update from "immutability-helper";

const CREATE = "CARD/CREATE";
const STARTED = "CARD/STARTED";
const DONE = "CARD/DONE";

const ADD_CRITERIA = "CARD/CRITERIA/ADD";
const SET_CRITERIA = "CARD/CRITERIA/SET";

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
  INPROGRESS: Symbol("INPROGRESS"),
  DONE: Symbol("DONE"),
  mapFrom: symbol => {
    if (symbol === cardStatus.TODO) return "TODO";
    if (symbol === cardStatus.INPROGRESS) return "INPROGRESS";
    if (symbol === cardStatus.DONE) return "DONE";
  },
  mapTo: text => {
    if (text === "TODO") return cardStatus.TODO;
    if (text === "INPROGRESS") return cardStatus.INPROGRESS;
    if (text === "DONE") return cardStatus.DONE;
  }
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
  if (title === undefined || title.length === 0)
    throw new Error("Argument title is mandatory");
  return async (dispatch, getState, { api }) => {
    const newCard = card(title);
    await api.Cards.Post(newCard).then(res => {
      dispatch(createCardSuccess(res.Id, newCard));
    });
  };
};
export const setCriteriasTypology = type => {
  return async (dispatch, getState, { api }) => {};
};

export const updateCardStatusForward = id => {
  if (id === undefined) throw new Error("Argument id is mandatory");

  return async (dispatch, getState, { api }) => {
    const card = getCard(getState(), id);
    if (card === undefined)
      throw new Error("Card with id " + id + " can't be found");
    switch (card.Status) {
      case cardStatus.TODO:
        if (card.Criterias === undefined || card.Criterias.length === 0)
          throw new Error(
            "Can't change status of card " +
              id +
              " to INPROGRESS to a card without criteria"
          );
        await api.Cards.Post(card, { Status: cardStatus.INPROGRESS });
        dispatch(startCard(id));
        break;
      case cardStatus.INPROGRESS:
        await api.Cards.Post(card, { Status: cardStatus.DONE });
        dispatch(doneCard(id));
        break;

      default:
        console.debug(card);
        throw new Error("Card has not handled state " + card.Status);
    }
  };
};

export const toggleCardCriteria = (id, idCriteria, valueCriteria) => {
  if (
    id === undefined ||
    idCriteria === undefined ||
    valueCriteria === undefined
  )
    throw new Error(
      "Id Card, Id Criteria and Value Criteria arguments are mandatory"
    );
  return async (dispatch, getState, { api }) => {
    const card = getCard(getState(), id);
    if (card === undefined)
      throw new Error("Card with id " + id + " can't be found");

    if (card.Criterias === undefined || card.Criterias.length === 0)
      throw new Error("No criterias are attached to the card " + id);
    const idxCriteria = card.Criterias.findIndex(c => c.Id === idCriteria);

    if (idxCriteria === -1)
      throw new Error(
        "Criteria with id " + idCriteria + " can't be found in card " + id
      );

    if (card.Criterias[idxCriteria].Value === false) {
      await api.Cards.Post(card, { Id: idCriteria, Value: valueCriteria });

      dispatch(setCardCriteria(id, idCriteria, valueCriteria));

      const updatedCard = getCard(getState(), id);
      if (updatedCard.Criterias.every(c => c.Value === true))
        dispatch(doneCard(id));
    }
  };
};

export const retrieveAllCards = type => {
  if (type === undefined) throw new Error("Argument type is mandatory");
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

export const addCriteria = (id, { idCriteria, defaultValue }) => ({
  type: ADD_CRITERIA,
  payload: {
    Id: id,
    Criteria: {
      Id: idCriteria,
      Value: defaultValue
    }
  }
});

export const setCardCriteria = (id, idCriteria, valueCriteria) => ({
  type: SET_CRITERIA,
  payload: {
    Id: id,
    Criteria: {
      Id: idCriteria,
      Value: valueCriteria
    }
  }
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
    type: STARTED,
    payload: {
      Id: id
    }
  };
};

export const doneCard = id => {
  if (id === undefined) throw new Error("Id arg is mandatory");
  return {
    type: DONE,
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

    case STARTED:
      return reducerUpdateCardStatus(state, action, cardStatus.INPROGRESS);

    case DONE:
      return reducerUpdateCardStatus(state, action, cardStatus.DONE);

    case ADD_CRITERIA: {
      const cardIdx = state.list.findIndex(c => c.Id === action.payload.Id);

      return {
        ...state,
        list: update(state.list, {
          [cardIdx]: {
            Criterias: criterias =>
              update(criterias || [], { $push: [action.payload.Criteria] })
          }
        })
      };
    }
    case SET_CRITERIA: {
      let cardIdx = state.list.findIndex(c => c.Id === action.payload.Id);
      const criteriaIdx = state.list[cardIdx].Criterias.findIndex(
        c => c.Id === action.payload.Criteria.Id
      );

      return {
        ...state,
        list: update(state.list, {
          [cardIdx]: {
            Criterias: {
              [criteriaIdx]: {
                $merge: { Value: action.payload.Criteria.Value }
              }
            }
          }
        })
      };
    }
    default:
      return state;
  }

  function reducerUpdateCardStatus(state, action, status) {
    const idx = state.list.findIndex(c => c.Id === action.payload.Id);
    let mergeObject = {};
    mergeObject[idx] = { $merge: { Status: status } };
    return { ...state, list: update(state.list, mergeObject) };
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
export function getCard(state, id) {
  return getAllCards(state).find(c => c.Id === id);
}
export function getAllCards(state) {
  return getCards(validateState(state)).list || [];
}

export function getAllCardsInProgess(state) {
  return getAllCards(state).filter(isCardStatusInProgess);
}

export function getAllCardsTodo(state) {
  return getAllCards(state).filter(isCardStatusToDo);
}

export function getAllCardsDone(state) {
  return getAllCards(state).filter(isCardStatusDone);
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
function isCardStatusDone(card) {
  return card.Status === cardStatus.DONE;
}
