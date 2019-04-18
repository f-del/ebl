import { connect } from "react-redux";
import { getPersona } from "../redux/modules/personas";
import Hypothesis from "../components/Hypothesis";
import { getHypothesisSelected } from "../redux/modules/ui";
import { getCard } from "../redux/modules/cards";

const mapStateToProps = (state, ownsProp) => {
  const hypothesis = getCard(state, getHypothesisSelected(state));
  const persona = getPersona(
    state,
    hypothesis !== undefined ? hypothesis.Persona.Id : ""
  );

  return { hypothesis, persona };
};

const mapDispatchToProps = (dispatch, ownsProp) => ({});

const HypothesisSelected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Hypothesis);

export default HypothesisSelected;
