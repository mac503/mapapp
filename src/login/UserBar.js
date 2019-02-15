import React from "react";
import "./UserBar.css";

export default function UserBar(props){
  return (
    <div id='userBar' onClick={props.handleClick}>
      {props.isLoggedIn ? 'Logout' : 'Edit'}
    </div>
  );
}
