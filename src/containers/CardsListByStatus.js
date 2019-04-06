import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardStatus,
  getAllCardsTodo,
  getAllCardsInProgess
} from "../redux/modules/cards";
import CardsList from "../components/CardsList";

function helperGetCards(state, ownProps) {
  if (ownProps.status === cardStatus.Todo) return getAllCardsTodo(state);
  if (ownProps.status === cardStatus.Inprogress)
    return getAllCardsInProgess(state);
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
  status: PropTypes.string.isRequired
};

export default CardListByStatus;
