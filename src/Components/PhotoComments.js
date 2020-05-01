import React,{Component} from "react"

class  PhotoComments extends Component{
    render(){
        return <div className="comment">
            <form className="comment-form">
                <input type="text" placeholder=" Enter Comment" name="comment"/>
                <input type="submit" hidden/>
            </form>
        </div>
    }
}

export default PhotoComments;