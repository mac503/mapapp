import React from "react";
import "./Photos.css";

export default function Photos(props){
  return (
    <div className="camera">
      <label>
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 18">
        <circle cx="12" cy="12" r="3.2"/>
        <path d="M9 2l-1.83 2h-3.17c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2h-3.17l-1.83-2h-6zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          <path d="M0 0h24v24h-24z" fill="none"/>
        </svg>
        <input type="file" multiple={true} accept="image/*" onChange={props.handleChange}/>
      </label>
    </div>
  );
}
