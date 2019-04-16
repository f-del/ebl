import React from "react";
import PropTypes from "prop-types";
import CreateHypothesisCard from "../containers/CreateHypothesisCard";
import CardListByStatus from "../containers/CardsListByStatus";
import { cardStatus, cardType } from "../redux/modules/cards";
import CardsBoard from "../containers/CardsBoard";

function Persona({ persona, addStory }) {
  return (
    <div>
      {persona.Name}
      <ul>
        {persona.Needs.map((p, i) => (
          <li key={i}>
            {p}
            {addStory !== undefined && (
              <React.Fragment>
                <CreateHypothesisCard
                  personaId={persona.Id}
                  personaNeedsIndex={i}
                />
                <CardsBoard type={cardType.Hypothesis}>
                  <CardListByStatus status={cardStatus.TODO} />
                </CardsBoard>
              </React.Fragment>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

Persona.propTypes = {
  persona: PropTypes.object.isRequired,
  addStory: PropTypes.bool.isRequired
};

export default Persona;
