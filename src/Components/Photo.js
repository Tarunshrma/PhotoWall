import React,{Component} from "react"
import "../styles/stylesheet.css"

class Photo extends Component{
    render(){
        const photo = this.props.post;
        return <figure className="figure">
            <img className="photo" src={photo.imageLink} alt={photo.description}></img>
            <figcaption><p>{photo.description}</p></figcaption>
            <div className="button-container">
                <button className="button" onClick={()=>{this.props.removePhoto(this.props.index)}}>Remove</button>
            </div>
        </figure>
    }
}

export default Photo;