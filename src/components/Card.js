import React from "react";
import PropTypes from "prop-types";
import CardActions from "./CardActions";
import CardActionnable from "../containers/CardActionnable";

function Card({ card }){
  return (
    <div>
      {card.Title}
      <CardActionnable id={card.Id} status={card.Status} />
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.object.isRequired
};
export default Card;
