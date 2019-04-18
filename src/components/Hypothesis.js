import React from "react";

import PropTypes from "prop-types";
import UiCard from "@material-ui/core/Card";
import UiCardContent from "@material-ui/core/CardContent";
import UiTypography from "@material-ui/core/Typography";
import Persona from "./Persona";

function Hypothesis({ hypothesis, persona }) {
  function getNeedsIdx() {
    return hypothesis !== undefined ? hypothesis.Persona.NeedsIndex : undefined;
  }

  if (hypothesis !== undefined) return displayCard();
  else return null;

  function displayCard() {
    return (
      <React.Fragment>
        <UiCard>
          {persona && (
            <UiCardContent>
              <Persona persona={persona} selectedNeeds={getNeedsIdx()} />
            </UiCardContent>
          )}
        </UiCard>
        <UiCard>
          <UiCardContent>
            <UiTypography variant="h2">{hypothesis.Title}</UiTypography>
          </UiCardContent>
        </UiCard>
      </React.Fragment>
    );
  }
}

Hypothesis.propTypes = {
  hypothesis: PropTypes.object
};

export default Hypothesis;
