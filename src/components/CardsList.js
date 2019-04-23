import React from "react";
import UiGridListTile from "@material-ui/core/GridListTile";
import CardSelectable from "./CardSelectable";

function CardsList({ list, status }) {
  return (
    <React.Fragment>
      {list.map((c, i) => (
        <UiGridListTile key={i}>
          <CardSelectable card={c} />
        </UiGridListTile>
      ))}
    </React.Fragment>
  );
}
export default CardsList;
