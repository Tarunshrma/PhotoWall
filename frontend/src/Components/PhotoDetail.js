import React, {Component} from "react"
import Photo from "./Photo"
import PhotoComments from "./PhotoComments"
// import { getComments} from '../apis/photowall-api'

class PhotoDetail extends Component{

    async componentDidMount() {

        console.log("PhotoDetail Props",this.props);

        // try {
        //   const selectedPhotoId = this.props.match.params.id;

        //   var comments = await getComments(this.props.auth.getAccessToken(),selectedPhotoId)

        //   console.log('Fetched comments ',comments)

        //   this.props.fetchComments(comments);  
        // } catch (e) {
        //   alert(`Failed to fetch posts: ${e.message}`)
        // }
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
             <PhotoComments photoId={selectedPhotoId} auth={this.props.auth} {...this.props}/>
             {/* <PhotoComments comments={comments} addComment={this.props.addComment} photoId={selectedPhotoId} auth={this.props.auth}/> */}
        </div>
    }

}

export default PhotoDetail;