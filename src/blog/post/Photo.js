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
        <img src={src} onClick={this.handleClick} />
        {this.state.zoom ? <PhotoModal filename={src} outerClick={this.handleClick} /> : null}
      </>
    );
  }
}
