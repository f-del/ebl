import React from "react";
import PropTypes from "prop-types";
import CardActionnable from "../containers/CardActionnable";

function Card({ card }) {
  return (
    <div>
      {card.Title}
      <CardActionnable card={card} />
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.object.isRequired
};
export default Card;
