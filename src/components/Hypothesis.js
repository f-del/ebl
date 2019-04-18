import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import UiCard from "@material-ui/core/Card";
import UiCardContent from "@material-ui/core/CardContent";
import UiTypography from "@material-ui/core/Typography";
import Persona from "./Persona";
import { getPersona } from "../redux/modules/personas";
import { getCard } from "../redux/modules/cards";

function Hypothesis({ hypothesis = {}, persona }) {
  return (
    <React.Fragment>
      <UiCard>
        <UiCardContent>
          <Persona
            persona={persona}
            selectedNeeds={hypothesis.Persona.NeedsIndex}
          />
        </UiCardContent>
      </UiCard>
      <UiCard>
        <UiCardContent>
          <UiTypography variant="h2">{hypothesis.Title}</UiTypography>
        </UiCardContent>
      </UiCard>
    </React.Fragment>
  );
}

Hypothesis.propTypes = {
  hypothesis: PropTypes.object
};

const mapStateToProps = (state, ownsProp) => ({
  persona: getPersona(
    state,
    ownsProp.Hypothesis !== undefined ? ownsProp.Hypothesis.Persona.Id : ""
  ),
  hypothesis: getCard(state, "vmwo0i6uTaLNlGAp9UuG ")
});

const mapDispatchToProps = (dispatch, ownsProp) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hypothesis);
