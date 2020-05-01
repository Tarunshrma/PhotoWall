import React, {Component} from "react"
import Photo from "./Photo"
import PhotoComments from "./PhotoComments"

class PhotoDetail extends Component{

    

    render(){
        const photos = this.props.posts;
        const selectedPhotoId = this.props.match.params.id;
        const photo = photos.find((photo) => photo.id == selectedPhotoId);
        
        return <div className="single-photo">
             <Photo post={photo}/>
             <PhotoComments/>
        </div>
    }

}

export default PhotoDetail;