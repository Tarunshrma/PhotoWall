import React,{Component} from "react"
import {Link} from "react-router-dom"

class Header extends Component{
    render(){
    return <h1>
        <Link to='/'>{this.props.title}</Link>
      </h1>
    };
  };

 export default Header;