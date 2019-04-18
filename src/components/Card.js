import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withTheme } from "@material-ui/core/styles";

import UiCard from "@material-ui/core/Card";
import UiCardContent from "@material-ui/core/CardContent";
import UiCardActions from "@material-ui/core/CardActions";
import UiTypography from "@material-ui/core/Typography";
import UiCardHeader from "@material-ui/core/CardHeader";
import UiAvatar from "@material-ui/core/Avatar";
// import UiIconButton from "@material-ui/core/IconButton";

// import IcoMoreVertIcon from "@material-ui/icons/MoreVert";
import { green, red, grey } from "@material-ui/core/colors";

import CardActionnable from "../containers/CardActionnable";
import { cardType } from "../redux/modules/cards";

const styles = {
  card: {
    maxWidth: 400
  },
  status_todo: {
    backgroundColor: grey[500]
  },
  status_inprogress: {
    backgroundColor: red[500]
  },
  status_done: {
    backgroundColor: green[500]
  }
};

function Card({ card, classes }) {
  const avatarColor = () => {
    if (card.Type === cardType.Task) return classes.status_todo;
    if (card.Type === cardType.Hypothesis) return classes.status_inprogress;
    if (card.Type === cardType.UserStory) return classes.status_done;
  };
  return (
    <UiCard className={classes.card}>
      <UiCardHeader
        avatar={
          <UiAvatar aria-label="Recipe" className={avatarColor()}>
            {card.Type.substring(0, 1).toUpperCase()}
          </UiAvatar>
        }
        // action={
        //   <UiIconButton>
        //     <IcoMoreVertIcon />
        //   </UiIconButton>
        // }
      />
      <UiCardContent>
        <UiTypography variant="h6">{card.Title}</UiTypography>
      </UiCardContent>
      <UiCardActions>
        <CardActionnable card={card} />
      </UiCardActions>
    </UiCard>
  );
}

Card.propTypes = {
  card: PropTypes.object.isRequired
};
export default withTheme()(withStyles(styles)(Card));
