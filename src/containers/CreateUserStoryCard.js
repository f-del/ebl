import PropTypes from "prop-types";
import { connect } from "react-redux";
import CreateCard from "../components/CreateCard";
import { addUserStoryToHypothesis } from "../redux/modules/cards";

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onValidate: title => {
    dispatch(addUserStoryToHypothesis(ownProps.hypothesisId, title));
  }
});

const CreateUserStoryCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCard);

CreateUserStoryCard.propTypes = {
  hypothesisId: PropTypes.string.isRequired
};

export default CreateUserStoryCard;
