import { connect } from "react-redux";
import { getUserStorySelected } from "../redux/modules/ui";
import { getCard } from "../redux/modules/cards";
import UserStory from "../components/UserStory";

const mapStateToProps = (state, ownsProp) => ({
  userStory: getCard(state, getUserStorySelected(state))
});

const mapDispatchToProps = (dispatch, ownsProp) => ({});

const UserStorySelected = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserStory);

export default UserStorySelected;
