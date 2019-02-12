import React from "react";
import './Time.css';

export default function Time(props){
  return (
    <span className='time'>{props.time}</span>
  );
}
