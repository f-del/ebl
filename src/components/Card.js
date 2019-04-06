import React from "react";
import PropTypes from "prop-types";

function Card({ card }) {
  return <div key={card.Id}>{card.Title}</div>;
}

Card.propTypes = {
  card: PropTypes.object.isRequired
};
export default Card;
