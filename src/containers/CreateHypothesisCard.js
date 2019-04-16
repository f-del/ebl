import PropTypes from "prop-types";
import { connect } from "react-redux";
import CreateCard from "../components/CreateCard";
import { createCard, cardType } from "../redux/modules/cards";

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onValidate: title => {
    dispatch(
      createCard(title, cardType.Hypothesis, {
        persona: {
          id: ownProps.personaId,
          needsIndex: ownProps.personaNeedsIndex
        }
      })
    );
  }
});

const CreateHypothesisCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCard);

CreateHypothesisCard.propTypes = {
  personaId: PropTypes.string.isRequired,
  personaNeedsIndex: PropTypes.number.isRequired
};

export default CreateHypothesisCard;
