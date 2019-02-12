import React from "react";
import "./SavingBar.css";

export default function SavingBar(props){
  return (
    <div id='savingBar'>
      {props.isUnsaved ? <span>Unsaved.</span> : null}
      {props.isSaving ? <span> Saving...</span> : null}
    </div>
  );
}
