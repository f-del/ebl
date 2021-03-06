import update from "immutability-helper";
import { criteriaType, getCriteria } from "./criterias";

const CREATE = "CARD/CREATE";
const STARTED = "CARD/STARTED";
const DONE = "CARD/DONE";

const ATTACH = "CARD/ATTACH";

const ADD_CRITERIA = "CARD/CRITERIA/ADD";
const SET_CRITERIA = "CARD/CRITERIA/SET";

const RETRIEVE = "CARD/RETRIEVE/START";
const RETRIEVED = "CARD/RETRIEVE/END";

const card = (title, type = cardType.Task) => ({
  Title: title,
  Status: cardStatus.TODO,
  Type: type
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
  Task: "TASK",
  Hypothesis: "HYPOTHESIS",
  UserStory: "USER-STORY"
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

/*
  title
  type = cardType.Task
  persona : { id, needsIndex }
 */
export const createCard = (
  title,
  type = cardType.Task,
  { persona, parentCard } = {}
) => {
  if (title === undefined || title.length === 0)
    throw new Error("Argument title is mandatory");
  if (
    type !== cardType.Task &&
    type !== cardType.Hypothesis &&
    type !== cardType.UserStory
  )
    throw new Error(
      "Optionnal argument type is not correct, should be come from cardType enum"
    );
  return async (dispatch, getState, { api }) => {
    const newCard = card(title, type);
    newCard.CreatedAt = new Date();

    if (persona !== undefined) {
      if (persona.id === undefined || persona.needsIndex === undefined)
        throw new Error(
          "Optionnal argument persona is not correct, should be {persona : {id, needsIndex}}"
        );

      newCard.Persona = { Id: persona.id, NeedsIndex: persona.needsIndex };
    }

    if (parentCard !== undefined) {
      if (parentCard.id === undefined)
        throw new Error(
          "Optionnal argument parentCard is not correct, should be {parentCard : {id}}"
        );
      newCard[type === cardType.UserStory ? "Hypothesis" : "UserStory"] = {
        Id: parentCard.id
      };
    }
    const res = await api.Cards.Post(newCard);
    dispatch(createCardSuccess(res.Id, newCard));

    return { ...newCard, Id: res.Id };
  };
};
export const setCriteriasTypology = (id, type = criteriaType.BASIC) => {
  if (id === undefined) throw new Error("Argument id is mandatory");
  return async (dispatch, getState, { api }) => {
    const card = _getCard(getState, id);
    if (
      card.Criterias !== undefined ||
      (card.Criterias !== undefined && card.Criterias.length > 0)
    )
      throw new Error("Card " + id + " has already criterias attached");

    const crit = getCriteria(getState(), type);

    await api.Cards.Post(card, { Criterias: crit });

    crit.forEach(c => {
      dispatch(addCriteria(id, c));
    });
  };
};

export const addChildCardToParent = (idParent, titleChildCard) => {
  return async (dispatch, getState, { api }) => {
    const parentCard = _getCard(getState, idParent);
    const childCard = await dispatch(
      createCard(
        titleChildCard,
        parentCard.Type === cardType.Hypothesis
          ? cardType.UserStory
          : cardType.Task,
        {
          parentCard: { id: idParent }
        }
      )
    );

    const [parentToChildLinkName] = _getLinksName(parentCard.Type);

    const parentCardChilds = parentCard[parentToChildLinkName];
    await api.Cards.Post(
      parentCard,
      parentCardChilds !== undefined
        ? {
            [parentToChildLinkName]: [...parentCardChilds, { Id: childCard.Id }]
          }
        : { [parentToChildLinkName]: [{ Id: childCard.Id }] }
    );

    dispatch(attachCards(parentCard.Id, childCard.Id, parentCard.Type));
  };
};

export const updateCardStatusForward = id => {
  if (id === undefined) throw new Error("Argument id is mandatory");

  return async (dispatch, getState, { api }) => {
    const card = _getCard(getState, id);
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
    const card = _getCard(getState, id);

    if (card.Criterias === undefined || card.Criterias.length === 0)
      throw new Error("No criterias are attached to the card " + id);

    const criteriasToUpdate = { Criterias: [...card.Criterias] };
    const idxCriteria = criteriasToUpdate.Criterias.findIndex(
      c => c.Id === idCriteria
    );
    if (idxCriteria === -1)
      throw new Error(
        "Criteria with id " + idCriteria + " can't be found in card " + id
      );

    if (criteriasToUpdate.Criterias[idxCriteria].Value === false) {
      await api.Cards.Post(
        card,
        update(criteriasToUpdate, {
          Criterias: {
            [idxCriteria]: {
              $merge: { Value: valueCriteria }
            }
          }
        })
      );

      dispatch(setCardCriteria(id, idCriteria, valueCriteria));

      const updatedCard = getCard(getState(), id);
      if (updatedCard.Criterias.every(c => c.Value === true))
        await dispatch(updateCardStatusForward(id));
    }
  };
};

export const retrieveAllCards = type => {
  if (type === undefined) throw new Error("Argument type is mandatory");
  return async (dispatch, getState, { api }) => {
    const currentState = getLoadingStatus(getState(), type);

    if (
      currentState === LOADING_STATE.NULL &&
      getAllCards(getState(), { type }).length !== 0
    )
      throw new Error("Could not retrieve cards in the current state");

    if (currentState === LOADING_STATE.NULL) {
      dispatch(retrieveAllCards_Starting(type));

      const cards = await api.Cards.Get(type);
      dispatch(retrieveAllCards_End(cards, type));
    }
  };
};

/* Functionnal helper */
function _getCard(getState, id) {
  const card = getCard(getState(), id);
  if (card === undefined)
    throw new Error("Card with id " + id + " can't be found");
  return card;
}
function _getLinksName(parentCardType) {
  return parentCardType === cardType.Hypothesis
    ? ["UserStories", "Hypothesis"]
    : ["Tasks", "UserStory"];
}

/***
 *     █████╗  ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
 *    ██╔══██╗██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
 *    ███████║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
 *    ██╔══██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
 *    ██║  ██║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
 *    ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝
 *
 */

export const createCardSuccess = (id, card) => {
  return {
    type: CREATE,
    payload: { Id: id, ...card }
  };
};

export const attachCards = (
  idParent,
  idChild,
  parentCardType = cardType.Hypothesis
) => ({
  type: ATTACH,
  payload: {
    IdParent: idParent,
    IdChild: idChild,
    parentCardType
  }
});

export const addCriteria = (id, criteria) => {
  const action = {
    type: ADD_CRITERIA,
    payload: {
      Id: id,
      Criteria: {
        Id: criteria.Id,
        Value: criteria.Value
      }
    }
  };
  if (criteria.Text !== undefined) action.payload.Criteria.Text = criteria.Text;
  return action;
};

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

export const retrieveAllCards_Starting = (type = cardType.Task) => {
  return {
    type: RETRIEVE,
    payload: {
      Type: type
    }
  };
};

export const retrieveAllCards_End = (cards, type = cardType.Task) => {
  return {
    type: RETRIEVED,
    payload: {
      Type: type,
      Cards: cards
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
  status: Object.values(cardType).reduce(
    (acc, ct) => ({ ...acc, [ct]: LOADING_STATE.NULL }),
    {}
  )
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RETRIEVE: {
      return {
        ...state,
        status: {
          ...state.status,
          [action.payload.Type]: LOADING_STATE.INPROGRESS
        }
      };
    }
    case RETRIEVED: {
      return {
        ...state,
        list: [...state.list, ...action.payload.Cards],
        status: { ...state.status, [action.payload.Type]: LOADING_STATE.DONE }
      };
    }
    case CREATE:
      return { ...state, list: [...state.list, action.payload] };

    case ATTACH: {
      const cardParentIdx = state.list.findIndex(
        c => c.Id === action.payload.IdParent
      );
      const cardChildIdx = state.list.findIndex(
        c => c.Id === action.payload.IdChild
      );
      console.log(
        "action.payload.parentCardType " + action.payload.parentCardType
      );
      const [parentToChildLinkName, childToParentLinkName] = _getLinksName(
        action.payload.parentCardType
      );

      return {
        ...state,
        list: update(state.list, {
          [cardParentIdx]: {
            [parentToChildLinkName]: stories =>
              update(stories || [], { $push: [{ Id: action.payload.IdChild }] })
          },
          [cardChildIdx]: {
            [childToParentLinkName]: hypothesis =>
              update(hypothesis || {}, {
                $set: { Id: action.payload.IdParent }
              })
          }
        })
      };
    }
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

export function getCardsById(state, idlist = []) {
  return getAllCards(state).filter(c => {
    return (
      idlist.findIndex(entity => {
        return c.Id === entity.Id;
      }) !== -1
    );
  });
}

/*
  Get all cards from state
  option : {
    type = cardType of cards
    persona : id of the attached persona
  }
*/
export function getAllCards(state, { ...option } = {}) {
  return (getCards(validateState(state)).list || []).filter(c =>
    and(
      and(isTypeCard(c, option.type), isPersona(c, option.persona)),
      isPersonaNeeds(c, option.needsIndex)
    )
  );
}

export function getAllCardsInProgess(state, { ...option } = {}) {
  return getAllCards(state).filter(c =>
    and(
      and(
        and(isCardStatusInProgess(c), isTypeCard(c, option.type)),
        isPersona(c, option.persona)
      ),
      isPersonaNeeds(c, option.needsIndex)
    )
  );
}

export function getAllCardsTodo(state, { ...option } = {}) {
  return getAllCards(state).filter(c =>
    and(
      and(
        and(isCardStatusToDo(c), isTypeCard(c, option.type)),
        isPersona(c, option.persona)
      ),
      isPersonaNeeds(c, option.needsIndex)
    )
  );
}

export function getAllCardsDone(state, { ...option } = {}) {
  return getAllCards(state).filter(c =>
    and(
      and(
        and(isCardStatusDone(c), isTypeCard(c, option.type)),
        isPersona(c, option.persona)
      ),
      isPersonaNeeds(c, option.needsIndex)
    )
  );
}

export function getLoadingStatus(state, type = cardType.Task) {
  return getCards(validateState(state)).status[type];
}

/* Functionnal helper */
function validateState(state) {
  if (state === undefined) throw new Error("State arg is mandatory");
  return state;
}
function getCards(state) {
  return state.cards || {};
}

function and(fn1, fn2) {
  return fn1 && fn2;
}

function isTypeCard(card, type) {
  return card.Type === (type || card.Type);
}

function isPersona(card, id) {
  return id !== undefined
    ? card.Persona !== undefined
      ? card.Persona.Id === id
      : false
    : true;
}

function isPersonaNeeds(card, needsIdx) {
  return needsIdx !== undefined && card.Persona !== undefined
    ? card.Persona.NeedsIndex !== undefined
      ? card.Persona.NeedsIndex === needsIdx
      : false
    : true;
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
