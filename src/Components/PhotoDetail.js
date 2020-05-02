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
        
        return <div className="single-photo">
             <Photo post={photo}/>
             <PhotoComments comments={this.props.comments} addComment={this.props.addComment}/>
        </div>
    }

}

export default PhotoDetail;