import React from "react";
import ContentEditable from 'react-contenteditable';

import "./Location.css";

export default function Location(props){
  return (
    <ContentEditable
      html={props.location}
      className="location"
      tagName="span"
      disabled={!props.isLoggedIn}
      onChange={(e)=> props.handleChange(e, 'location')}
      contentEditable="plaintext-only"
    />
  );
}
