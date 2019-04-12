import cards from "../modules/cards";
import criterias from "../modules/criterias";
import { combineReducers } from "redux";

const rootReducer = combineReducers({ cards, criterias });
export default rootReducer;
