import PropTypes from "prop-types";
import { connect } from "react-redux";

import Card from "./Card";
import { selectHypothesis, selectUserStory } from "../redux/modules/ui";
import { cardType } from "../redux/modules/cards";

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSelect: () => {
    if (ownProps.card.Type === cardType.Hypothesis)
      dispatch(selectHypothesis(ownProps.card));
    else if (ownProps.card.Type === cardType.UserStory)
      dispatch(selectUserStory(ownProps.card));
  }
});

const CardSelectable = connect(
  mapStateToProps,
  mapDispatchToProps
)(Card);

CardSelectable.propTypes = {
  card: PropTypes.object.isRequired
};

export default CardSelectable;
