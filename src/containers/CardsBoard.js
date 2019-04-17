import React from "react";
import { connect } from "react-redux";
import { retrieveAllCards, cardType } from "../redux/modules/cards";

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, ownsProp) => ({
  getCards: type => dispatch(retrieveAllCards(type || cardType.Task))
});

function CardsBoard({ type, getCards, children }) {
  getCards(type);
  return <div>{children}</div>;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsBoard);
