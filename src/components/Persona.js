import React from "react";
import PropTypes from "prop-types";
import CreateHypothesisCard from "../containers/CreateHypothesisCard";

function Persona({ persona, addStory }) {
  return (
    <div>
      {persona.Name}
      <ul>
        {persona.Needs.map((p, i) => (
          <li key={i}>
            {p}
            {addStory !== undefined && (
              <CreateHypothesisCard
                personaId={persona.Id}
                personaNeedsIndex={i}
              />
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
