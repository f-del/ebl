import { connect } from "react-redux";
import CreateCard from "../components/CreateCard";
import { createCard } from "../redux/modules/cards";

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = dispatch => ({
  onValidate: title => {
    dispatch(createCard(title));
  }
});

const CreateTaskCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateCard);

export default CreateTaskCard;
