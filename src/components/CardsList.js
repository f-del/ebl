import React from "react";
import Card from "./Card";
import UiGridListTile from "@material-ui/core/GridListTile";

function CardsList({ list, status }) {
  return (
    <React.Fragment>
      {list.map((c, i) => (
        <UiGridListTile key={i}>
          <Card card={c} />
        </UiGridListTile>
      ))}
    </React.Fragment>
  );
}
export default CardsList;
