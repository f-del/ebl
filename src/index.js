import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import { api } from "./API/api";

import reducer from "./redux/store/index";
import CreateCard from "./components/CreateCard";
import { createCard, cardStatus } from "./redux/modules/cards";
import CardListByStatus from "./containers/CardsListByStatus";

import "./styles.css";
/*
{cardsList.map(c => (
  <Card card={c} />
))}
function Card({ card }) {
  return <div>{card.title}</div>;
}

const cardsList = [{ title: "Creer une carte" }];

*/
let config = {
  apiKey: "AIzaSyBwM4YVUVijCR35f9D_vg1qHbF3OTotVb0",
  authDomain: "massive-pen-231814.firebaseapp.com",
  databaseURL: "https://massive-pen-231814.firebaseio.com",
  projectId: "massive-pen-231814",
  storageBucket: "massive-pen-231814.appspot.com",
  messagingSenderId: "61056570786"
};
firebase.initializeApp(config);
const db = firebase.firestore();

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument({ api: api(db) }))
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
        <CardListByStatus status={cardStatus.TODO} />
        <CardListByStatus status={cardStatus.INPROGRESS} />
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
