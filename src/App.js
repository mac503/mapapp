import React, {Component} from "react";
import {hot} from "react-hot-loader";
import "./App.css";
import UserBar from "./login/UserBar";
import LoginModal from "./login/LoginModal";
import Map from "./map/Map";
import Blog from "./blog/Blog";
import Photos from "./photos/Photos";
import sanitizeHTML from "sanitize-html";


class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: true,
      userName: 'mike',
      showLoginModal: false,
      showBlog: true,
      lat: 51.505,
      lng: -0.09,
      zoom: 5,
      posts: [],
    }
    this.mapRef = React.createRef();
    fetch('/api/posts/')
      .then(response => response.json())
      .then(json => this.setState({posts:json}));

    this.handleChange = this.handleChange.bind(this);
    this.hideBlog = this.hideBlog.bind(this);
    this.showBlog = this.showBlog.bind(this);
    this.handleMarkerClick= this.handleMarkerClick.bind(this);
    this.moveMap = this.moveMap.bind(this);
  }

  handleChange(id, prop, value){
    let posts = this.state.posts;
    posts.find(x=> x.id == id)[prop] = sanitizeHTML(value, {
      allowedTags: []
    });
    this.setState({posts:posts});
  }

  hideBlog(){
    this.setState({showBlog: false});
  }
  showBlog(){
    this.setState({showBlog: true});
  }
  handleMarkerClick(id){
    this.showBlog();
    document.querySelector(`[data-id="${id}"]`).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }
  moveMap(lat, lng){
    console.log(this.mapRef.current.leafletElement.panTo([lat, lng], {duration: 0.75}));
  }

  render(){
    return(
      <>
        {this.state.showLoginModal ? <LoginModal /> : null}
        <UserBar isLoggedIn={this.state.isLoggedIn} userName={this.state.userName} />
        <Map
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
          posts={this.state.posts}
          handleMarkerClick={this.handleMarkerClick}
          mapRef={this.mapRef}
        />
        {this.state.showBlog ?
          <Blog
            posts={this.state.posts}
            isLoggedIn={this.state.isLoggedIn}
            handleCloseButtonClick={this.hideBlog}
            handleChange={this.handleChange}
            handlePostClick={this.moveMap}
          />
          : null
        }
        {this.state.isLoggedIn ? <Photos /> : null}
      </>
    );
  }
}

export default hot(module)(App);

function sendData(){

}
