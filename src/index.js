import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import CssBaseline from "@material-ui/core/CssBaseline";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import { api } from "./API/api";

import reducer from "./redux/store/index";
import CardListByStatus from "./containers/CardsListByStatus";
import CardsBoard from "./containers/CardsBoard";
import CreateTaskCard from "./containers/CreateTaskCard";

import "./styles.css";
import { cardType, cardStatus } from "./redux/modules/cards";
import Persona from "./components/Persona";
import { getAllPersonas } from "./redux/modules/personas";
import { selectHypothesis } from "./redux/modules/ui";
import HypothesisSelected from "./containers/HypothesisSelected";

let config = {
  apiKey: "AIzaSyBwM4YVUVijCR35f9D_vg1qHbF3OTotVb0",
  authDomain: "massive-pen-231814.firebaseapp.com",
  databaseURL: "https://massive-pen-231814.firebaseio.com",
  projectId: "massive-pen-231814",
  storageBucket: "massive-pen-231814.appspot.com",
  messagingSenderId: "61056570786"
};

if (firebase.apps.length === 0) firebase.initializeApp(config);
const db = firebase.firestore();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunk.withExtraArgument({ api: api(db) })))
);

function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <h1>Personas List : </h1>
      <div className="App">
        {getAllPersonas(store.getState()).map(p => (
          <Persona key={p.Id} persona={p} addStory={true} />
        ))}
        <CreateTaskCard />
        <h1>Hypothesis Card : </h1>
        <button
          onClick={e =>
            store.dispatch(selectHypothesis({ Id: "vmwo0i6uTaLNlGAp9UuG" }))
          }
        >
          Select Hypothesis
        </button>
        <HypothesisSelected />
        <h1>Tasks Board : </h1>
        <CardsBoard type={cardType.Task}>
          <CardListByStatus type={cardType.Task} status={cardStatus.TODO} />
          <CardListByStatus
            type={cardType.Task}
            status={cardStatus.INPROGRESS}
          />
          <CardListByStatus type={cardType.Task} status={cardStatus.DONE} />
        </CardsBoard>
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
