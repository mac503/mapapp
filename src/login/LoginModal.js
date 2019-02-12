import React from "react";
import Modal from "../modal/Modal.js";
import "./LoginModal.css";

export default function LoginModal(props){
  const content = (
    <>
      <h1>Login</h1>
      <br/>
      <form>
        <label>Username<br/>
          <input type='text' />
        </label><br/>
        <label>Password<br/>
          <input type='password' />
        </label>
      </form>
    </>
  );
  return (
    <Modal content={content} class='login-modal'/>
  );
}
