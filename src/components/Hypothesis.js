import React from "react";

import PropTypes from "prop-types";
import UiCard from "@material-ui/core/Card";
import UiCardContent from "@material-ui/core/CardContent";
import UiTypography from "@material-ui/core/Typography";
import UiGridListTile from "@material-ui/core/GridListTile";
import UiPaper from "@material-ui/core/Paper";
import Persona from "./Persona";
import CreateUserStoryCard from "../containers/CreateUserStoryCard";
import CardsBoard from "../containers/CardsBoard";
import { cardType, cardStatus } from "../redux/modules/cards";
import CardListByStatus from "../containers/CardsListByStatus";

function Hypothesis({ hypothesis, persona, classes }) {
  function getNeedsIdx() {
    return hypothesis !== undefined ? hypothesis.Persona.NeedsIndex : undefined;
  }

  if (hypothesis !== undefined) return displayCard();
  else return null;

  function displayCard() {
    return (
      <React.Fragment>
        <UiCard>
          {persona && (
            <UiCardContent>
              <Persona
                persona={persona}
                addStory={false}
                selectedNeeds={getNeedsIdx()}
              />
            </UiCardContent>
          )}
        </UiCard>
        <UiCard>
          <UiCardContent>
            <UiTypography variant="h2">{hypothesis.Title}</UiTypography>
          </UiCardContent>
        </UiCard>

        <UiPaper>
          <UiTypography variant="h3">
            Describe the {persona.Name} Journey
          </UiTypography>
        </UiPaper>
        <CardsBoard type={cardType.UserStory}>
          <UiGridListTile>
            <CreateUserStoryCard hypothesisId={hypothesis.Id} />
          </UiGridListTile>
          <CardListByStatus
            type={cardType.UserStory}
            status={cardStatus.TODO}
          />
        </CardsBoard>
      </React.Fragment>
    );
  }
}

Hypothesis.propTypes = {
  hypothesis: PropTypes.object
};

export default Hypothesis;
