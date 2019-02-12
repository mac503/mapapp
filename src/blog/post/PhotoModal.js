import React from "react";
import Modal from "../../modal/Modal.js";

export default function PhotoModal(props){
  const content = (
    <>
      <img src={props.filename} />
    </>
  );
  return (
    <Modal content={content} outerClick={props.outerClick} class='photo-modal'/>
  );
}
