import React, {Component} from "react"
import Photo from "./Photo"
import PhotoComments from "./PhotoComments"

class PhotoDetail extends Component{

    componentDidMount(){
        console.log(this.props);
    }

    render(){
        const photos = this.props.posts;
        const selectedPhotoId = Number(this.props.match.params.id);
        const photo = photos.find((photo) => photo.id === selectedPhotoId);

        const comments = this.props.comments[this.props.match.params.id] || []
        const index = this.props.posts.findIndex((post) => post.id === selectedPhotoId)
        
        return <div className="single-photo">
             <Photo post={photo} {...this.props} index={index}/>
             <PhotoComments comments={comments} addComment={this.props.addComment} photoId={selectedPhotoId}/>
        </div>
    }

}

export default PhotoDetail;