import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardStatus,
  getAllCardsTodo,
  getAllCardsInProgess,
  getAllCardsDone
} from "../redux/modules/cards";
import CardsList from "../components/CardsList";

function helperGetCards(state, ownProps) {
  if (ownProps.status === cardStatus.TODO)
    return getAllCardsTodo(state, {
      type: ownProps.type,
      ...ownProps.filterBy
    });
  if (ownProps.status === cardStatus.INPROGRESS)
    return getAllCardsInProgess(state, {
      type: ownProps.type,
      ...ownProps.filterBy
    });
  if (ownProps.status === cardStatus.DONE)
    return getAllCardsDone(state, {
      type: ownProps.type,
      ...ownProps.filterBy
    });

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
  status: PropTypes.symbol.isRequired,
  type: PropTypes.string.isRequired
};

export default CardListByStatus;
