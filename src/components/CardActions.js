import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import UiTypography from "@material-ui/core/Typography";
import UiMenuItem from "@material-ui/core/MenuItem";
import UiSelect from "@material-ui/core/Select";
import UiInputLabel from "@material-ui/core/InputLabel";
import UiFormControl from "@material-ui/core/FormControl";
import UiFormControlLabel from "@material-ui/core/FormControlLabel";
import UiFormGroup from "@material-ui/core/FormGroup";
import UiFormHelperText from "@material-ui/core/FormHelperText";
import UiButton from "@material-ui/core/Button";
import UiCheckbox from "@material-ui/core/Checkbox";

import { cardStatus } from "../redux/modules/cards";

const styles = theme => ({
  root: {
    color: green[600],
    "&$checked": {
      color: green[500]
    }
  },
  checked: {},
  button: {
    spacing: theme.spacing.unit
  }
});
function CardActions({ card, onAction, criterias_typology_list, classes }) {
  const displayINPROGRESS = () => (
    <UiFormControl component="fieldset">
      <UiTypography component="legend">Done criterias :</UiTypography>
      <UiFormGroup>
        {card.Criterias.map(crit => (
          <UiFormControlLabel
            key={crit.Id}
            disabled={crit.Value === true}
            control={
              <UiCheckbox
                id={"tdod_" + card.Id + "_" + crit.Id}
                classes={{
                  root: classes.root,
                  checked: classes.checked
                }}
                value={crit.Id}
                checked={crit.Value === true}
                onChange={e => handleCheckBox(e, crit.Id)}
              />
            }
            label={crit.Text}
            labelPlacement="start"
          />
        ))}
      </UiFormGroup>
    </UiFormControl>
  );

  const displayTODO = () => (
    <UiButton
      color="primary"
      size="small"
      className={classes.button}
      onClick={onAction}
    >
      Start
    </UiButton>
  );

  const displayTODO_AffectCriterias = () => (
    <UiFormControl>
      <UiInputLabel htmlFor={`criteriaSelect${card.Id}`}>DoD</UiInputLabel>
      <UiSelect
        id={`criteriaSelect${card.Id}`}
        onChange={handleSelect}
        value=""
      >
        {criterias_typology_list.map((ct, i) => (
          <UiMenuItem key={i} value={Object.keys(ct)[0]}>
            {ct.Text || Object.keys(ct)}
          </UiMenuItem>
        ))}
      </UiSelect>

      <UiFormHelperText>Affect a Definition of Done workflow</UiFormHelperText>
    </UiFormControl>
  );

  if (card.Status === cardStatus.TODO)
    if (card.Criterias !== undefined && card.Criterias.length > 0)
      return displayTODO();
    else return displayTODO_AffectCriterias();

  if (card.Status === cardStatus.INPROGRESS) return displayINPROGRESS();

  return null;
  function handleSelect(e) {
    onAction({ value: e.target.value });
  }

  function handleCheckBox(e, id) {
    onAction({ id: "" + id, value: e.target.checked });
  }
}

CardActions.propTypes = {
  card: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired
};

export default withStyles(styles)(CardActions);
