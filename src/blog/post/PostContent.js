import React from "react";
import ContentEditable from 'react-contenteditable';
import "./PostContent.css";

export default function PostContent(props){
  return (
    <ContentEditable
      html={props.content}
      className="post-content"
      tagName="div"
      disabled={!props.isLoggedIn}
      onChange={(e)=> props.handleChange(e, 'content')}
      contentEditable="plaintext-only"
    />
  );
}
