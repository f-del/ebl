import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UiGridList from "@material-ui/core/GridList";
import { withStyles } from "@material-ui/core";
import { retrieveAllCards } from "../redux/modules/cards";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: "nowrap",
    width: "100vw",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, ownsProp) => ({
  getCards: type => dispatch(retrieveAllCards(type))
});

function CardsBoard({ type, getCards, children, classes }) {
  getCards(type);

  const displayChildren = () => {
    return React.Children.map(children, c => {
      return React.cloneElement(c, { type: type });
    });
  };

  return (
    <div className={classes.root}>
      <UiGridList className={classes.gridList} cols={2.5}>
        {displayChildren()}
      </UiGridList>
    </div>
  );
}

CardsBoard.propTypes = {
  type: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CardsBoard));
