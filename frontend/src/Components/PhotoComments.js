import React,{Component} from "react"
import { addComment,getComments} from '../apis/photowall-api'

class  PhotoComments extends Component{
    constructor(){
        super();
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    async handleAddComment(event){
        event.preventDefault();
        const newComment = event.target.elements.comment.value;
        const photoId = this.props.photoId;
        if(newComment !== ''){
            event.target.elements.comment.value = "";
            const comment  =  await addComment(this.props.auth.getAccessToken(),photoId,{comment:newComment}) 
            
            console.log("Add comments at backend",comment);
            this.props.addComment(comment,photoId);
        }
    }

    async componentDidMount() {

        console.log("PhotoComment Props",this.props);

        try {
          const selectedPhotoId = this.props.photoId;//this.props.match.params.id;

          var comments = await getComments(this.props.auth.getAccessToken(),selectedPhotoId)

          console.log('Fetched comments ',comments)

          this.props.fetchComments(comments);  
        } catch (e) {
          alert(`Failed to fetch posts: ${e.message}`)
        }
    }

    render(){
        return <div className="comment" >
            {this.props.comments.map((comment,index)=>{
                return <p key={index}> {comment.comment} </p>
            })}
            <form className="comment-form" onSubmit={this.handleAddComment}>
                <input type="text" placeholder=" Enter Comment" name="comment"/>
                <input type="submit" hidden/>
            </form>
        </div>
    }
}

export default PhotoComments;