import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllCards } from "../redux/modules/cards";

function CardList({ list }) {
  return (
    <div>
      {list.map(c => (
        <div key={c.Id}>{c.Title}</div>
      ))}
    </div>
  );
}
const mapStateToProps = state => ({
  list: getAllCards(state)
});

const mapDispatchToProps = dispatch => ({});

CardList.propTypes = {
  list: PropTypes.array.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardList);
