import React from "react";
import "./Latlng.css";

export default function Latlng(props){
  return (
    <span className='latlng'>{props.lat}, {props.lng}</span>
  );
}
