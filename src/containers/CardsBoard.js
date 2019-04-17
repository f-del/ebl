import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { retrieveAllCards } from "../redux/modules/cards";

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, ownsProp) => ({
  getCards: type => dispatch(retrieveAllCards(type))
});

function CardsBoard({ type, getCards, children }) {
  getCards(type);

  const displayChildren = () => {
    return React.Children.map(children, c => {
      return React.cloneElement(c, { type: type });
    });
  };

  return <div>{displayChildren()}</div>;
}

CardsBoard.propTypes = {
  type: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsBoard);
