import React from "react";
import Card from "./Card";
import { cardStatus } from "../redux/modules/cards";

function CardsList({ list, status }) {
  return (
    <div>
      {list.map((c, i) => (
        <Card key={i} card={c} />
      ))}
    </div>
  );
}
export default CardsList;
