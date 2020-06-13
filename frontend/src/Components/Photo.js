import React,{Component} from "react"
import "../styles/stylesheet.css"
import {Link} from "react-router-dom"
import { deletePost} from '../apis/photowall-api'
import posts from "../data/Posts"
import { Visibility } from "semantic-ui-react"

class Photo extends Component{

    onPostDelete = async (postId) => {
        try {
            console.log("Deleting post with id",postId)
            
            await deletePost(this.props.auth.getIdToken(),postId)
            console.log("Deleted post with id",postId)

            if(this.props.history){
                this.props.history.push('/');
            }

            this.props.removePhoto(this.props.index)
            console.log("Updating local state",postId)
            
        } catch (e) {
            alert(`Failed to delete posts: ${e.message}`)
        }
       
        
      }

    render(){
        const photo = this.props.post;
        const currentUser = false;//this.props.auth.isCurrentUser(photo.userId)

        return <figure className="figure">
            <Link to={`/PhotoDetail/${photo.postId}`}>
                <img className="photo" src={photo.ImageUrl} alt={photo.description}></img>
            </Link>
            <figcaption><p>{photo.description}</p></figcaption>

            <div className="button-container">
                
                <button className="button" onClick={()=>{
                        this.onPostDelete(photo.postId)
                    } } Visibility={currentUser}>
                    Remove
                </button>

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