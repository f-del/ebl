import { connect } from "react-redux";
import { getPersona } from "../redux/modules/personas";
import Hypothesis from "../components/Hypothesis";
import { getHypothesisSelected } from "../redux/modules/ui";

const mapStateToProps = (state, ownsProp) => ({
  persona: getPersona(
    state,
    ownsProp.hypothesis !== undefined ? ownsProp.hypothesis.Persona.Id : ""
  ),
  hypothesis: getHypothesisSelected(state)
});

const mapDispatchToProps = (dispatch, ownsProp) => ({});

const HypothesisSelected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Hypothesis);

export default HypothesisSelected;
