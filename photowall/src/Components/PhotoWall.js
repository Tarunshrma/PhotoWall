import React,{Component} from "react"
import Photo from "./Photo"
import "../styles/stylesheet.css"
import PropTypes from 'prop-types';

class PhotoWall extends Component{
    render(){
        
        return<div>
                <a onClick={this.props.navigate} className = "addIcon" href="#AddPhoto">

                </a>
                <div className="photoGrid">{this.props.posts.map((post,index)=> <Photo key={index} post={post} onPhotoRemove={this.props.onPhotoRemove}></Photo>)}) </div>
            </div>
    }
}

PhotoWall.propTypes = {
    posts : PropTypes.array.isRequired,
    onPhotoRemove: PropTypes.func.isRequired,
    navigate:PropTypes.func.isRequired
}

export default PhotoWall