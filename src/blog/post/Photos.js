import React from "react";
import Photo from './Photo.js';
import './Photos.css';

export default function Photos(props){
  if(props.photos === null) return null;
  const photos = props.photos.split(',').map(filename => (
    <Photo key={filename} filename={filename} />
  ));
  return (
    <div className='photos-holder'>{photos}</div>
  );
}
