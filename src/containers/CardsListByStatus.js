import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardStatus,
  getAllCardsTodo,
  getAllCardsInProgess
} from "../redux/modules/cards";
import CardsList from "../components/CardsList";

function helperGetCards(state, ownProps) {
  if (ownProps.status === cardStatus.TODO) return getAllCardsTodo(state);
  if (ownProps.status === cardStatus.INPROGRESS)
    return getAllCardsInProgess(state);

  throw new Error("Status not recognized, should come from cardStatus");
}

const mapStateToProps = (state, ownProps) => ({
  list: helperGetCards(state, ownProps)
});

const mapDispatchToProps = dispatch => ({});

const CardListByStatus = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsList);

CardListByStatus.propTypes = {
  status: PropTypes.symbol.isRequired
};

export default CardListByStatus;
