import React from "react";
import "./UserBar.css";

export default function UserBar(props){
  return (
    <div id='userBar'>
      {props.isLoggedIn ? 'Logout' : 'Edit'}
    </div>
  );
}
