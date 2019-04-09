import React from "react";
import PropTypes from "prop-types";
import CardActions from "./CardActions";
import { cardStatus } from "../redux/modules/cards";

function Card({ card }) {
  function handleCardAction() {
    if (card.Status === cardStatus.TODO) {
    }
  }

  return (
    <div>
      {card.Title}
      <CardActions status={card.Status} onAction={handleCardAction} />
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.object.isRequired
};
export default Card;
