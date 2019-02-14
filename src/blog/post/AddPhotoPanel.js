import React from "react";
import Photo from './Photo.js';
import Modal from "../../modal/Modal.js";
import './AddPhotoPanel.css';

export default function AddPhotoPanel(props){
  //TODO find the null photos higher up the chain (or here?) by comparing them to the posts - find the ones which don't appear in any post
  console.log(props.photos);
  const photos = props.photos.filter(x=>x.postId==null).map(photo => (
    <img key={photo.id} src={'/photos/'+photo.filename} data-id={photo.id} onClick={(e)=>props.addPhoto(e, props.postId)} />
  ));
  console.log(photos);
  const content = (
    <div className='add-photos-panel'>
      <div className='photos-holder'>
        {photos.length > 0 ? photos : 'No unused photos. Click the camera at the bottom left to upload more.'}
      </div>
    </div>
  );
  return (
    <Modal content={content} outerClick={props.outerClick} class='photo-modal'/>
  );
}
