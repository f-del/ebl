import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardStatus,
  toggleCardCriteria,
  setCriteriasTypology,
  updateCardStatusForward
} from "../redux/modules/cards";
import CardActions from "../components/CardActions";
import { getAllCriterias } from "../redux/modules/criterias";

const mapStateToProps = (state, ownProps) => ({
  criterias_typology_list: getAllCriterias(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAction: newValue => {
    if (ownProps.card.Status === cardStatus.TODO) {
      if (
        ownProps.card.Criterias !== undefined &&
        ownProps.card.Criterias.length > 0
      )
        dispatch(updateCardStatusForward(ownProps.card.Id));
      else dispatch(setCriteriasTypology(ownProps.card.Id, newValue.value));
    } else if (ownProps.card.Status === cardStatus.INPROGRESS)
      dispatch(
        toggleCardCriteria(ownProps.card.Id, newValue.id, newValue.value)
      );
  }
});

const CardActionnable = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardActions);

CardActionnable.propTypes = {
  card: PropTypes.object.isRequired
};

export default CardActionnable;
