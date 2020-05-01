import React,{Component} from "react"
import Photo from "./Photo"
import "../styles/stylesheet.css"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

class PhotoWall extends Component{
    render(){
        
        return<div>
                <Link className="addIcon" to="/AddPhoto"/>
                <div className="photoGrid">{this.props.posts.map((post,index)=> <Photo key={index} post={post} {...this.props} index={index}></Photo>)}) </div>
            </div>
    }
}

PhotoWall.propTypes = {
    posts : PropTypes.array.isRequired,
    // onPhotoRemove: PropTypes.func.isRequired
}

export default PhotoWall