import React, {Component} from "react";
import AddPhotoPanel from './AddPhotoPanel';
import './AddPhotoButton.css';

export default class AddPhotoButton extends Component{
  constructor(props){
    super(props);
    this.state = {
      show: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(){
    this.setState({
      show: !this.state.show,
    });
  }

  render(){
    return (
      <button className='add-photo-button' onClick={this.toggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 18">
          <circle cx="12" cy="12" r="3.2"/>
          <path d="M9 2l-1.83 2h-3.17c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2h-3.17l-1.83-2h-6zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            <path d="M0 0h24v24h-24z" fill="none"/>
        </svg>
        {this.state.show
          ? <AddPhotoPanel
            photos={this.props.photos}
            addPhoto={this.props.addPhoto}
            outerClick={this.toggle}
            postId={this.props.postId}
          />
          : null
        }
      </button>
    );
  }
}
