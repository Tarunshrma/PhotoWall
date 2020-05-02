import React,{Component} from "react"
import "../styles/stylesheet.css"
import {Link} from "react-router-dom"

class Photo extends Component{
    render(){
        const photo = this.props.post;
        return <figure className="figure">
            <Link to={`/PhotoDetail/${photo.id}`}>
                <img className="photo" src={photo.imageLink} alt={photo.description}></img>
            </Link>
            <figcaption><p>{photo.description}</p></figcaption>
            <div className="button-container">
                <button className="button" onClick={()=>{
                        this.props.removePhoto(this.props.index)
                        if(this.props.history){
                            this.props.history.push('/');
                        }
                        
                    }}>Remove</button>
            </div>
        </figure>
    }
}

export default Photo;