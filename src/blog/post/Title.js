import React from "react";
import ContentEditable from 'react-contenteditable';
import './Title.css';

export default function Title(props){
  return (
    <ContentEditable
      html={props.title}
      className="post-title"
      tagName="div"
      disabled={!props.isLoggedIn}
      onChange={(e)=> props.handleChange(e, 'title')}
      contentEditable="plaintext-only"
    />
  );
}
