import React, {Component} from "react";
import Latlng from './post/Latlng';
import Location from './post/Location';
import Title from './post/Title';
import PostContent from './post/PostContent';
import PostDate from './post/PostDate';
import Photos from './post/Photos';
import './Post.css';
import CountryColors from './CountryColors';

export default class Post extends Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, property){
    let value = e.target.value;
    if(property == 'date'){
      const date = new Date(Date.parse(this.props.date)).toString();
      let newDate = new Date(e.target.value);
      newDate.setHours(date.substr(16,2), date.substr(19,2));
      value = newDate.toISOString();
    }
    else if(property == 'time'){
      let newDate = new Date(this.props.date);
      const timeSplit = e.target.value.split(':');
      newDate.setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1]));
      property = 'date';
      value = newDate.toISOString();
    }
    this.props.handleChange(this.props.id, property, value);
  }

  render(){
    const colorEntry = CountryColors.find(c=> c.country == this.props.country);
    let background = 'gray';
    if(colorEntry){
      const colors = colorEntry.colors;
      const interval = parseInt(100 / colors.length);
      background = 'linear-gradient(to right, ';
      for(let i = 0; i < colors.length ; i++){
        background += colors[i] + ' ' + interval*i + '%, ';
        background += colors[i] + ' ' + interval*(i+1) + '%, ';
      }
      background = background.substr(0, background.length-2) + ')';
    }
    return (
      <div className='post-wrapper'>
        <div
          className='post-country-column'
          style={{background:background}}
          >{this.props.newCountry == true ? this.props.country : null }</div>
        <div className='post-content-wrapper'>
          <div className='post-date-row'>{this.props.newYear == true ? <span>{this.props.date.substr(0,4)}</span> : null}</div>
          <div className='post' data-id={this.props.id} onClick={() => this.props.handleClick(this.props.lat, this.props.lng)}>
            <PostDate
              date={this.props.date}
              isLoggedIn={this.props.isLoggedIn}
              handleChange={this.handleChange}
            />
            <div className='location-wrapper'><Location handleChange={this.handleChange} isLoggedIn={this.props.isLoggedIn} location={this.props.location}/> <Latlng lat={this.props.lat} lng={this.props.lng} /></div>
            <Photos photos={this.props.photos}/>
            <Title handleChange={this.handleChange} isLoggedIn={this.props.isLoggedIn} title={this.props.title}/>
            <PostContent handleChange={this.handleChange} isLoggedIn={this.props.isLoggedIn} content={this.props.content}/>
          </div>
        </div>
      </div>
    );
  }
}
