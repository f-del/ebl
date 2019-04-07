import React from "react";
import { connect } from "react-redux";
import { retrieveAllCards, cardType } from "../../redux/modules/cards";

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, ownsProp) => ({
  getCards: () => dispatch(retrieveAllCards(cardType.Task))
});

function CardsListContext({ type, getCards, children }) {
  getCards(type);
  return <div>{children}</div>;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsListContext);
