import { Map, Marker, Tooltip, Popup } from 'react-leaflet';
import MapBoxGLLayer from './mapbox';
import React, {Component, createRef} from "react";

export default class LeafletMap extends Component{
  constructor(props){
    super(props);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDrag(e, id, ref){
    const latLng = ref.current.leafletElement.getLatLng();
    this.props.handleChange(id, 'lat', latLng.lat);
    this.props.handleChange(id, 'lng', latLng.lng);
    const post = this.props.posts.find(x=> x.id == id);
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+latLng.lat+'&lon='+latLng.lng)
      .then(response => response.json())
      .then(json => {
        console.log(json.address);
        this.props.handleChange(id, 'location', json.address.city || json.address.town || json.address.village || json.address.locality || json.address.state_district || 'Location Unknown', false);
        this.props.handleChange(id, 'country', json.address.country);
      });
  }

  render(){
    const position = this.props.posts.length > 0 ? [this.props.posts[0].lat, this.props.posts[0].lng] : [0,0];
    const markers = this.props.posts.map((marker) => {
      const markerRef = createRef();
      return(
        <Marker
          draggable = {this.props.isLoggedIn}
          key={marker.id}
          position={[marker.lat, marker.lng]}
          onClick={() => this.props.handleMarkerClick(marker.id)}
          onDragend={(e) => this.handleDrag(e, marker.id, markerRef)}
          ref={markerRef}
        >
        </Marker>
      )
    });
    return (
      <Map center={position} zoom={this.props.zoom} ref={this.props.mapRef}>
        <MapBoxGLLayer
          accessToken="pk.eyJ1IjoibWlrZWNhcnRlciIsImEiOiJjam1uajgxbzUwYm40M2xwM3d5emdlYzB3In0.gnEbTwHtxbLfDJtQZsROSw"
          style="mapbox://styles/mapbox/outdoors-v10"
        />
        {markers}
      </Map>
    );
  }
}
