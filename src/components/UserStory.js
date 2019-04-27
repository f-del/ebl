import React from "react";
import PropTypes from "prop-types";

import UiGridListTile from "@material-ui/core/GridListTile";
import CardsBoard from "../containers/CardsBoard";
import { cardType } from "../redux/modules/cards";
import CardListByIdList from "../containers/CardListByIdList";

function UserStory({ userStory }) {
  if (userStory === undefined) return null;

  return (
    <CardsBoard type={cardType.Task}>
      <UiGridListTile>
        {/* <CreateTaskCard userStoryId={userStory.Id} /> */}
      </UiGridListTile>
      <CardListByIdList list={userStory.Tasks} />
    </CardsBoard>
  );
}

UserStory.propTypes = {
  userStory: PropTypes.object
};

export default UserStory;
