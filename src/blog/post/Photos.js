import React from "react";
import Photo from './Photo.js';
import AddPhotoButton from './AddPhotoButton.js';
import './Photos.css';

export default function Photos(props){
  let photos = null;
  if(props.photos != null) photos = props.photos.split(',').map(id => (
    <Photo
      key={id}
      filename={props.allPhotos.find(x=>x.id == id).filename}
      isLoggedIn={props.isLoggedIn}
      removePhoto={props.removePhoto}
      postId={props.postId}
      photoId={id}
    />
  ));
  return (
    <>
      <div className='photos-holder'>
        {photos}
        {props.isLoggedIn
          ? <AddPhotoButton photos={props.allPhotos}
                            addPhoto={props.addPhoto}
                            postId={props.postId}
            />
          : null
        }
      </div>
    </>
  );
}
