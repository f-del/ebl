import React, { useState } from "react";
import PropTypes from "prop-types";

const MODE_READ = 1;
const MODE_FORM = 2;

function CreateCard({ onValidate }) {
  let [mode, setMode] = useState(MODE_READ);
  let [value, setValue] = useState("");

  const handleKeys = e => {
    const isEnterKey = e.which === 13;
    if (e.which === 27) {
      setValue("");
      setMode(MODE_READ);
    } else {
      if (value !== "" && isEnterKey) {
        onValidate(value);
        setValue("");
        setMode(MODE_READ);
      }
    }
    if (isEnterKey) e.preventDefault();
  };

  const displayForm = () => (
    <textarea
      onKeyDown={handleKeys}
      onChange={e => setValue(e.target.value)}
      rows="8"
      cols="17"
      autoFocus={true}
    />
  );
  const displayButton = () => (
    <button onClick={() => setMode(MODE_FORM)}>Create new task</button>
  );

  return (
    <div className={`create-card${mode === MODE_FORM ? "--actif" : ""}`}>
      {mode === MODE_FORM && displayForm()}
      {mode === MODE_READ && displayButton()}
    </div>
  );
}

CreateCard.propTypes = {
  onValidate: PropTypes.func.isRequired
};

export default CreateCard;
