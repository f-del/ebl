import cards from "../modules/cards";
import criterias from "../modules/criterias";
import personas from "../modules/personas";
import ui from "../modules/ui";
import { combineReducers } from "redux";

const rootReducer = combineReducers({ cards, criterias, personas, ui });
export default rootReducer;
