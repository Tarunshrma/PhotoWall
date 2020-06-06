import React, {Component} from "react"
import Photo from "./Photo"
import PhotoComments from "./PhotoComments"

class PhotoDetail extends Component{

    componentDidMount(){
        console.log("PhotoDetail Props",this.props);
    }

    render(){

       

        const photos = this.props.posts;
        console.log("All Posts",photos);

        const selectedPhotoId = this.props.match.params.id;

        const photo = photos.find((ph) => ph.postId === selectedPhotoId);
        console.log("Searched Photo",photo);

        const comments = this.props.comments[this.props.match.params.id] || []
        const index = this.props.posts.findIndex((post) => post.postId === selectedPhotoId)
        
        return <div className="single-photo">
             <Photo post={photo} {...this.props} index={index}/>
             <PhotoComments comments={comments} addComment={this.props.addComment} photoId={selectedPhotoId}/>
        </div>
    }

}

export default PhotoDetail;