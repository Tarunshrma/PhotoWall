import React,{Component} from "react"
import "../styles/stylesheet.css"
import {Link} from "react-router-dom"
import { deletePost} from '../apis/photowall-api'

class Photo extends Component{

    onPostDelete = async (postId) => {
        try {
            await deletePost(this.props.auth.getAccessToken(),postId)
            this.props.removePhoto(this.props.index)
            
        } catch (e) {
            alert(`Failed to delete posts: ${e.message}`)
        }
       
        if(this.props.history){
            this.props.history.push('/');
        }
      }

    render(){
        const photo = this.props.post;

        return <figure className="figure">
            <Link to={`/PhotoDetail/${photo.postId}`}>
                <img className="photo" src={photo.ImageUrl} alt={photo.description}></img>
            </Link>
            <figcaption><p>{photo.description}</p></figcaption>
            <div className="button-container">
                <button className="button" onClick={()=>{
                        this.onPostDelete(photo.postId)
                    }}>Remove</button>
            <Link className="button" to={`/PhotoDetail/${photo.postId}`}> 
                <div className="comment-count"> 
                <div className="speech-bubble"> </div>
                    {this.props.comments[photo.postId] ? this.props.comments[photo.postId].length : 0 }
                 </div>
            </Link>
            </div>
        </figure>
    }
}

export default Photo;