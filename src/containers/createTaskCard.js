import { connect } from "react-redux";
import CreateCard from "../components/CreateCard";
import { createCard, cardType } from "../redux/modules/cards";
import { addChildCardToParent } from "../redux/modules/cards";

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onValidate: title => {
    if (ownProps.userStoryId === undefined) dispatch(createCard(title));
    else
      dispatch(
        addChildCardToParent(ownProps.userStoryId, title, cardType.UserStory)
      );
  }
});

const CreateTaskCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCard);

export default CreateTaskCard;
