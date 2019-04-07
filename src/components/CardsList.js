import React from "react";
import Card from "./Card";
import { cardStatus } from "../redux/modules/cards";

function CardsList({ list, status }) {
  return (
    <div
      style={
        status === cardStatus.TODO ? { color: "blue" } : { color: "green" }
      }
    >
      {list.map((c, i) => (
        <Card key={i} card={c} />
      ))}
    </div>
  );
}
export default CardsList;
