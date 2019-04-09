import React from "react";
import PropTypes from "prop-types";

import { cardStatus } from "../redux/modules/cards";

function CardActions({ status, onAction }) {
  const devDoneCriteria = [
    { Id: 1, Name: "Dev" },
    { Id: 2, Name: "Unit Test" }
  ];

  const displayINPROGRESS = () => (
    <div>
      Done criterias:
      <ul>
        {devDoneCriteria.map(c => (
          <li key={c.Id}>
            <input
              id={"tdod_" + c.Id}
              type="checkbox"
              value="c.Id"
              onChange={handleCheckBox}
            />
            <label htmlFor={"tdod_" + c.Id}>{c.Name}</label>
          </li>
        ))}
      </ul>
    </div>
  );

  const displayTODO = () => (
    <div>
      <button onClick={() => onAction()}>Start</button>
    </div>
  );

  if (status === cardStatus.TODO) return displayTODO();

  if (status === cardStatus.INPROGRESS) return displayINPROGRESS();

  function handleCheckBox(e) {
    onAction(e.target.checked);
  }
}

CardActions.propTypes = {
  status: PropTypes.symbol.isRequired,
  onAction: PropTypes.func.isRequired
};

export default CardActions;
