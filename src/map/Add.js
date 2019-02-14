import React from "react";
import "./Add.css";

export default function Add(props){
  return (
    <div className={'add'+(props.dropPinsAllowed ? ' dropPins' : '')} onClick={props.handleClick}>
      <svg viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 1 v4 M1 3 h4" />
      </svg>
    </div>
  );
}
