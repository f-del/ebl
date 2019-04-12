import React from "react";
import PropTypes from "prop-types";

import { cardStatus } from "../redux/modules/cards";

function CardActions({ card, onAction, criterias_typology_list }) {
  const displayINPROGRESS = () => (
    <div>
      Done criterias:
      <ul>
        {card.Criterias.map(crit => (
          <li key={crit.Id}>
            <input
              id={"tdod_" + card.Id + "_" + crit.Id}
              type="checkbox"
              value={crit.Id}
              checked={crit.Value === true}
              readOnly={crit.Value === true}
              onChange={e => handleCheckBox(e, crit.Id)}
            />
            <label htmlFor={"tdod_" + card.Id + "_" + crit.Id}>
              {crit.Text}
            </label>
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
