import cards from "../modules/cards";
import criterias from "../modules/criterias";
import personas from "../modules/personas";
import { combineReducers } from "redux";

const rootReducer = combineReducers({ cards, criterias, personas });
export default rootReducer;
