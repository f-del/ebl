import React from "react";
import PropTypes from "prop-types";
import CreateHypothesisCard from "../containers/CreateHypothesisCard";
import CardListByStatus from "../containers/CardsListByStatus";
import { cardStatus, cardType } from "../redux/modules/cards";
import CardsBoard from "../containers/CardsBoard";

function Persona({ persona, addStory, selectedNeeds }) {
  const filtredNeeds = () => {
    if (selectedNeeds !== undefined)
      return persona.Needs.filter((n, i) => i === selectedNeeds);
    else return persona.Needs;
  };
  return (
    <div>
      {persona.Name}
      <ul>
        {filtredNeeds().map((p, i) => (
          <li key={i}>
            {p}
            {addStory && (
              <React.Fragment>
                <CreateHypothesisCard
                  personaId={persona.Id}
                  personaNeedsIndex={i}
                />
                <CardsBoard type={cardType.Hypothesis}>
                  <CardListByStatus
                    type={cardType.Hypothesis}
                    status={cardStatus.TODO}
                    filterBy={{ persona: persona.Id, needsIndex: i }}
                  />
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
