import PropTypes from "prop-types";
import { connect } from "react-redux";
import CardsList from "../components/CardsList";
import { getCardsById } from "../redux/modules/cards";

const mapStateToProps = (state, ownProps) => ({
  list: getCardsById(state, ownProps.list)
});

const mapDispatchToProps = dispatch => ({});

const CardListByIdList = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsList);

CardListByIdList.propTypes = {
  list: PropTypes.array
};

export default CardListByIdList;
