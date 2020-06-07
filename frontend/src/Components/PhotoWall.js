import React,{Component} from "react"
import Photo from "./Photo"
import "../styles/stylesheet.css"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { getAllPosts} from '../apis/photowall-api'

class PhotoWall extends Component{

    async componentDidMount() {
        try {
          var posts = await getAllPosts(this.props.auth.getAccessToken())
          this.props.fetchPhotos(posts);  
        } catch (e) {
          alert(`Failed to fetch posts: ${e.message}`)
        }
    }


    render(){
        
        return<div>
                <Link className="addIcon" to="/AddPhoto"/>
                <div className="photoGrid">{this.props.posts.map((post,index)=> <Photo key={index} post={post} {...this.props} index={index}></Photo>)}) </div>
            </div>
    }
}

PhotoWall.propTypes = {
    posts : PropTypes.array.isRequired,
}

export default PhotoWall