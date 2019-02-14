import React, {Component} from "react";
import {hot} from "react-hot-loader";
import "./App.css";
import UserBar from "./login/UserBar";
import SavingBar from "./login/SavingBar";
import LoginModal from "./login/LoginModal";
import Map from "./map/Map";
import Blog from "./blog/Blog";
import Photos from "./photos/Photos";
import Add from "./map/Add";
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
      dropPinsAllowed: false,
      lat: 51.505,
      lng: -0.09,
      zoom: 5,
      posts: [],
      lastSavedPosts: [],
      photos: [],
      currentSavingPosts: [],
      isUnsaved: false,
      isSaving: false,
    }
    this.mapRef = React.createRef();
    fetch('/api/posts/')
      .then(response => response.json())
      .then(json => this.setState({
          posts:json.posts,
          lastSavedPosts:JSON.parse(JSON.stringify(json.posts)),
          photos:json.photos,
        }));

    this.handleChange = this.handleChange.bind(this);
    this.hideBlog = this.hideBlog.bind(this);
    this.showBlog = this.showBlog.bind(this);
    this.handleMarkerClick= this.handleMarkerClick.bind(this);
    this.moveMap = this.moveMap.bind(this);
    this.toggleDropPins = this.toggleDropPins.bind(this);
    this.addPost = this.addPost.bind(this);
    this.fetchLocation = this.fetchLocation.bind(this);
    this.uploadPhotos = this.uploadPhotos.bind(this);
    this.addPhoto = this.addPhoto.bind(this);
    this.removePhoto = this.removePhoto.bind(this);
  }

  handleChange(id, prop, value, locationOverride=true){
    let posts = JSON.parse(JSON.stringify(this.state.posts));
    let post = posts.find(x=> x.id == id);
    if(post == null) post = posts.find(x=> x.tempId == id);
    if(post == null) console.error('Error: Trying to update a post which doesn\'t exist');
    post[prop] = sanitizeHTML(value, {
      allowedTags: []
    });
    if(prop == 'location' && locationOverride) post.locationOverriden = 1;
    this.setState({
      isUnsaved: true,
      posts: posts
    });
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
  toggleDropPins(){
    this.setState({dropPinsAllowed: !this.state.dropPinsAllowed})
  }
  addPost(e){
    if(this.state.dropPinsAllowed == false) return;
    if(!e.originalEvent.shiftKey) this.toggleDropPins();
    let posts = JSON.parse(JSON.stringify(this.state.posts));
    const newId = 10000 + posts.length;
    posts.push({
      id: newId,
      tempId: newId,
      date: new Date(Math.max.apply(Math, posts.map(x=> new Date(x.date).getTime()))).toISOString(),
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      location: 'Unknown Location',
      locationOverriden: 0,
      country: '',
      title: 'Title',
      content: 'Text',
      photos: null,
      isNew: true,
    });
    this.setState({
        posts:posts,
      },
      ()=>{
        this.fetchLocation(newId, e.latlng.lat, e.latlng.lng);
        document.querySelector(`[data-id="${newId}"]`).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }
    );
  }

  fetchLocation(id, lat, lng){
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&lon='+lng)
      .then(response => response.json())
      .then(json => {
        console.log(json.address);
        this.handleChange(id, 'location', json.address.city || json.address.town || json.address.village || json.address.locality || json.address.state_district || 'Location Unknown', false);
        const country = json.address.country == 'PRC' ? 'China' : json.address.country;
        this.handleChange(id, 'country', country);
      });
  }

  addPhoto(e, postId){
    e.stopPropagation();
    let existingPhotos = JSON.parse(JSON.stringify(this.state.posts.find(x=>x.id==postId))).photos;
    if(existingPhotos == null) existingPhotos = '';
    const newPhotos = existingPhotos.split(',').concat(e.target.dataset.id).filter(x=> x!='').join(',');
    this.handleChange(postId, 'photos', newPhotos);
    let photos = JSON.parse(JSON.stringify(this.state.photos));
    photos.find(x=> x.id == e.target.dataset.id).postId = postId;
    this.setState({
      photos: photos
    });
  }

  removePhoto(e, postId){
    e.stopPropagation();
    let existingPhotos = JSON.parse(JSON.stringify(this.state.posts.find(x=>x.id==postId))).photos;
    if(existingPhotos == null) return;
    existingPhotos = existingPhotos.split(',');
    existingPhotos.splice(existingPhotos.indexOf(''+e.target.closest('.remove-image').dataset.id), 1);
    let newPhotos = existingPhotos.filter(x=> x!='').join(',');
    if(newPhotos == '') newPhotos = null;
    this.handleChange(postId, 'photos', newPhotos);
    let photos = JSON.parse(JSON.stringify(this.state.photos));
    photos.find(x=> x.id == e.target.closest('.remove-image').dataset.id).postId = null;
    this.setState({
      photos: photos
    });
  }

  save(){
    if(this.state.lastSavedPosts !== this.state.posts){
      const posts = this.state.posts;
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
          const currentPosts = JSON.parse(JSON.stringify(this.state.posts));
          if(Object.keys(response.idsMap).length > 0){
            for(let id in response.idsMap){
              id = parseInt(id);
              const foundPost = posts.find(x=> x.id === id);
              if(foundPost){
                foundPost.id = response.idsMap[id];
                delete foundPost.isNew;
              }
              const foundCurrentPost = currentPosts.find(x=> x.id === id);
              if(foundCurrentPost){
                foundCurrentPost.id = response.idsMap[id];
                delete foundCurrentPost.isNew;
              }
            }
          }
          this.setState({
            isSaving: false,
            lastSavedPosts: posts,
            isUnsaved: (this.state.posts !== posts),
            posts: currentPosts,
          });
          console.log('Success:', JSON.stringify(response));
        })
        .catch(error => console.error('Error:', error));
      }
    }
  }

  uploadPhotos(e){
    if(e.target.files.length > 0){
      const formData = new FormData();
      for(let i=0; i<e.target.files.length; i++){
        const blob = e.target.files[i];
        if([
          'image/gif',
          'image/png',
          'image/jpeg',
          'image/bmp'
        ].includes(blob.type)) formData.append('photos', e.target.files[i]);
      }
      if(formData.has('photos') == false) return;
      else fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        const photos = this.state.photos.concat(response);
        this.setState({
          photos: photos
        });
      })
      .catch(error => console.error('Error:', error));
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
          handleMapClick={this.addPost}
          handleChange={this.handleChange}
          mapRef={this.mapRef}
          isLoggedIn={this.state.isLoggedIn}
          dropPinsAllowed={this.state.dropPinsAllowed}
          fetchLocation={this.fetchLocation}
        />
        {this.state.showBlog ?
          <Blog
            posts={this.state.posts}
            photos={this.state.photos}
            isLoggedIn={this.state.isLoggedIn}
            handleCloseButtonClick={this.hideBlog}
            handleChange={this.handleChange}
            handlePostClick={this.moveMap}
            addPhoto={this.addPhoto}
            removePhoto={this.removePhoto}
          />
          : null
        }
        {this.state.isLoggedIn
          ? <>
              <Photos handleChange={this.uploadPhotos} />
              <Add handleClick={this.toggleDropPins} dropPinsAllowed={this.state.dropPinsAllowed} />
            </>
          : null
        }
      </>
    );
  }
}

export default hot(module)(App);
