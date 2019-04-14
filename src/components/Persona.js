import React from "react";
import PropTypes from "prop-types";
import CreateUserStoryCard from "../containers/CreateUserStoryCard";

function Persona({ persona, addStory }) {
  return (
    <div>
      {persona.Name}
      <ul>
        {persona.Needs.map((p, i) => (
          <li key={i}>
            {p}
            {addStory !== undefined && (
              <CreateUserStoryCard
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
