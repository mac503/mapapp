import { Map, Marker, Tooltip, Popup } from 'react-leaflet';
import MapBoxGLLayer from './mapbox';
import React from "react";

export default function LeafletMap(props){
  const position = props.posts.length > 0 ? [props.posts[0].lat, props.posts[0].lng] : [0,0];
  const markers = props.posts.map((marker) => (
    <Marker
      draggable = {true}
      key={marker.id}
      position={[marker.lat, marker.lng]}
      onClick={() => props.handleMarkerClick(marker.id)}
    >
    </Marker>
  ));
  return (
    <Map center={position} zoom={props.zoom} ref={props.mapRef}>
      <MapBoxGLLayer
        accessToken="pk.eyJ1IjoibWlrZWNhcnRlciIsImEiOiJjam1uajgxbzUwYm40M2xwM3d5emdlYzB3In0.gnEbTwHtxbLfDJtQZsROSw"
        style="mapbox://styles/mapbox/outdoors-v10"
      />
      {markers}
    </Map>
  );
}
