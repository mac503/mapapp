import React, {Component} from "react";
import {hot} from "react-hot-loader";
import "./App.css";
import UserBar from "./login/UserBar";
import SavingBar from "./login/SavingBar";
import LoginModal from "./login/LoginModal";
import Map from "./map/Map";
import Blog from "./blog/Blog";
import Photos from "./photos/Photos";
import sanitizeHTML from "sanitize-html";
import BeforeUnload from "react-beforeunload";

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
      lastSavedPosts: [],
      currentSavingPosts: [],
      isUnsaved: false,
      isSaving: false,
    }
    this.mapRef = React.createRef();
    fetch('/api/posts/')
      .then(response => response.json())
      .then(json => this.setState({
          posts:json,
          lastSavedPosts:JSON.parse(JSON.stringify(json))
        }));

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

  save(){
    if(this.state.lastSavedPosts !== this.state.posts){
      const posts = this.state.posts;
      console.log(posts === this.state.posts);
      let changes = [];
      posts.forEach((post) => {
        const savedPost = this.state.lastSavedPosts.find(x=> x.id == post.id);
        if(!savedPost) changes.push(post);
        else{
          let toUpdate = false;
          let postUpdates = {};
          for(let prop in post){
            if(savedPost.hasOwnProperty(prop) == false || post[prop] != savedPost[prop]){
              toUpdate = true;
              postUpdates.id = post.id;
              postUpdates[prop] = post[prop];
            }
          }
          if(toUpdate){
            changes.push(postUpdates);
          }
        }
      });
      if(changes.length > 0 && this.state.isSaving == false){
        this.setState({
          isSaving: true,
          currentSavingPosts: posts
        });
        console.log('Saving: ', changes);
        fetch('/api/posts/', {
          method: 'POST',
          body: JSON.stringify(changes),
          headers:{
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then(response => {
          this.setState({
            isSaving: false,
            lastSavedPosts: posts,
            isUnsaved: (this.state.posts !== posts)
          });
          console.log('Success:', JSON.stringify(response));
        })
        .catch(error => console.error('Error:', error));
      }
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.save(),
      10000 //save every 10 seconds
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render(){
    return(
      <>
        <BeforeUnload
          onBeforeunload={e => {
              if(this.state.isUnsaved){
                var confirmationMessage = 'Are you sure? Some changes are unsaved.';
                (e || window.event).returnValue = confirmationMessage; //Gecko + IE, Chrome(mac os)
                return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
              }
            }
          }
        />
        {this.state.showLoginModal ? <LoginModal /> : null}
        <SavingBar isSaving={this.state.isSaving} isUnsaved={this.state.isUnsaved} />
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
