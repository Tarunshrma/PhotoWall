import React,{Component} from "react"

class  PhotoComments extends Component{
    constructor(){
        super();
        this.handleAddComment = this.handleAddComment.bind(this);
    }

    handleAddComment(event){
        event.preventDefault();
        const newComment = event.target.elements.comment.value;
        const photoId = this.props.photoId;
        if(newComment !== ''){
            this.props.addComment(newComment,photoId);
            event.target.elements.comment.value = "";
        }
    }

    componentDidMount(){
        console.log(this.props);
    }

    render(){
        return <div className="comment" >
            {this.props.comments.map((comment,index)=>{
                return <p key={index}> {comment} </p>
            })}
            <form className="comment-form" onSubmit={this.handleAddComment}>
                <input type="text" placeholder=" Enter Comment" name="comment"/>
                <input type="submit" hidden/>
            </form>
        </div>
    }
}

export default PhotoComments;