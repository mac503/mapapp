import React from "react";
import Time from './Time.js';
import './PostDate.css';

export default function PostDate(props){
  const date = new Date(Date.parse(props.date)).toString();
  const dateString = date.substr(8, 3) + date.substr(4, 3);
  const inputDate = new Date(props.date).toISOString().substr(0,10);
  const time = date.substr(16, 5);
  return (
    props.isLoggedIn
    ? <><input className='post-date' type='date' value={inputDate} /> <input className='time' type='time' value={time} /></>
    : <div className='post-date'>{dateString}<Time time={time} /></div>
  );
}
