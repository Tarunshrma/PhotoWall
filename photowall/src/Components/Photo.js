import React,{Component} from "react"
import "../styles/stylesheet.css"

class Photo extends Component{
    render(){
        const photo = this.props.photo;
        return <figure className="figure"></figure>
    }
}

export default Photo;