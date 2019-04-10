import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import { api } from "./API/api";

import reducer from "./redux/store/index";
import CreateCard from "./components/CreateCard";
import { createCard, cardStatus, cardType } from "./redux/modules/cards";
import CardListByStatus from "./containers/CardsListByStatus";

import "./styles.css";
import TaskCardsBoard from "./containers/TaskCardsBoard";

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
      <div className="App">
        <CreateCard
          onValidate={title => {
            store.dispatch(createCard(title));
          }}
        />
        <TaskCardsBoard type={cardType.Task}>
          <CardListByStatus status={cardStatus.TODO} />
          <CardListByStatus status={cardStatus.INPROGRESS} />
          <CardListByStatus status={cardStatus.DONE} />
        </TaskCardsBoard>
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
