import React from "react";
import PropTypes from "prop-types";

import { cardStatus } from "../redux/modules/cards";

function CardActions({ card, onAction, criterias_typology_list }) {
  const displayINPROGRESS = () => (
    <div>
      Done criterias:
      <ul>
        {card.Criterias.map(c => (
          <li key={c.Id}>
            <input
              id={"tdod_" + c.Id}
              type="checkbox"
              value={c.Id}
              checked={c.Value === true}
              readOnly={c.Value === true}
              onChange={e => handleCheckBox(e, c.Id)}
            />
            <label htmlFor={"tdod_" + c.Id}>{c.Name}</label>
          </li>
        ))}
      </ul>
    </div>
  );

  const displayTODO = () => (
    <div>
      <button onClick={onAction}>Start</button>
    </div>
  );

  const displayTODO_AffectCriterias = () => (
    <div>
      <select onChange={handleSelect}>
        <option>Affect a DoD to task</option>
        {criterias_typology_list.map((ct, i) => (
          <option key={i} value={Object.keys(ct)[0]}>
            {ct.Text || Object.keys(ct)}
          </option>
        ))}
      </select>
    </div>
  );

  if (card.Status === cardStatus.TODO)
    if (card.Criterias !== undefined && card.Criterias.length > 0)
      return displayTODO();
    else return displayTODO_AffectCriterias();

  if (card.Status === cardStatus.INPROGRESS) return displayINPROGRESS();

  return null;
  function handleSelect(e) {
    onAction({ value: e.target.value });
  }

  function handleCheckBox(e, id) {
    onAction({ id: "" + id, value: e.target.checked });
  }
}

CardActions.propTypes = {
  card: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired
};

export default CardActions;
