import React,{Component} from "react"
import Photo from "./Photo"
import "../styles/stylesheet.css"

class PhotoWall extends Component{
    render(){
        return <div className="photoGrid">{this.props.posts.map((post,index)=> <Photo key={index} post={post}></Photo>)}) </div>
    }
}

export default PhotoWall