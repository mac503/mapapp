import React, {Component} from "react";
import PhotoModal from "./PhotoModal.js";
import "./PhotoModal.css";

export default class Photo extends Component{
  constructor(props){
    super(props);
    this.state = {
      zoom: false,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    e.stopPropagation();
    const zoom = !this.state.zoom;
    this.setState({zoom: zoom});
  }

  render(){
    const src = '/photos/'+this.props.filename;
    return (
      <>
        <div className='photo-wrapper'>
          <img src={src} onClick={this.handleClick} />
          {this.state.zoom ? <PhotoModal filename={src} outerClick={this.handleClick} /> : null}
          {this.props.isLoggedIn
            ? <div className='remove-image' data-id={this.props.photoId} onClick={(e) => this.props.removePhoto(e, this.props.postId)}>
              <svg viewBox="0 0 40 40"><path d="M 10,10 L 30,30 M 30,10 L 10,30"></path></svg>
            </div>: null}
        </div>
      </>
    );
  }
}
