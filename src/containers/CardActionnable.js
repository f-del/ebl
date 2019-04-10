import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardStatus,
  createCard,
  toggleCardCriteria
} from "../redux/modules/cards";
import CardActions from "../components/CardActions";

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAction: newValue => {
    if (ownProps.status === cardStatus.TODO) dispatch(createCard(ownProps.id));
    else if (ownProps.status === cardStatus.INPROGRESS)
      dispatch(toggleCardCriteria(ownProps.id, newValue.id, newValue.value));
  }
});

const CardActionnable = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardActions);

CardActionnable.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.symbol.isRequired
};

export default CardActionnable;