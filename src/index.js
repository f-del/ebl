import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import { api } from "./API/api";

import reducer from "./redux/store/index";
import CreateCard from "./components/CreateCard";
import { createCard } from "./redux/modules/cards";
import CardList from "./components/Cards";

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

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument({ api }))
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
        <CardList />
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
