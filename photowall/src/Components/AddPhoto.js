import React,{Component} from "react"

class AddPhoto extends Component{

    constructor(){
        super();
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnSubmit(event){
        event.preventDefault();
        const url = event.target.elements.url.value;
        const caption = event.target.elements.caption.value;

        const post = {
            id: Number(new Date()),
            description: caption,
            imageLink: url
        }
        if (caption && url){
            this.props.onAddPhoto(post)
        }
    }

    render(){
        return <div>
         <h1>PhotoWall</h1>
         <form className="form" onSubmit={this.handleOnSubmit}>
             <input type="text" placeholder="Enter Url" name="url"/>
             <input type="text" placeholder="Enter Caption" name="caption"/>
             <button>Post</button>
         </form>
         </div>
    };
}

export default  AddPhoto