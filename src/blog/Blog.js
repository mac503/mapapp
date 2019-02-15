import React from "react";
import "./Blog.css";
import Post from "./Post.js";
import FlipMove from 'react-flip-move';

export default function Blog(props){
  const orderedPosts = props.posts.concat().sort((a,b) => new Date(a.date) - new Date(b.date));
  const posts = orderedPosts.map((post, i) => (
    <Post
      key={post.id}
      {...post}
      allPhotos={props.photos}
      addPhoto={props.addPhoto}
      isLoggedIn={props.isLoggedIn}
      newYear={(i==0 || post.date.substr(0,4) != orderedPosts[i-1].date.substr(0,4))}
      newMonth={(i==0 || post.date.substr(5,2) != orderedPosts[i-1].date.substr(5,2))}
      newCountry={(i==0 || post.country != orderedPosts[i-1].country)}
      handleClick={props.handlePostClick}
      handleChange={props.handleChange}
      removePhoto={props.removePhoto}
    />
  ));
  return (
    <div id='blog'>
      <div className='close-button' onClick={props.handleCloseButtonClick}>
        <svg viewBox="0 0 40 40">
          <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
        </svg>
      </div>
      <div className='content'>
        <FlipMove>
          {posts}
        </FlipMove>
      </div>
    </div>
  );
}
