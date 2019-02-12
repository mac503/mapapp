import React from "react";
import "./Modal.css";

export default function Modal(props){
  return (
    <div className='modal' onClick={props.outerClick}>
      <div className={props.class+' modal-content'}>
        {props.content}
      </div>
    </div>
  );
}
