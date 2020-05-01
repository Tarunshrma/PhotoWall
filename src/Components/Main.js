import React,{Component} from "react" 
import Header from "./Header"
import PhotoWall from "./PhotoWall"
import AddPhoto from "./AddPhoto"
import { Route } from "react-router-dom";
import "../styles/stylesheet.css"
import PhotoDetail from "./PhotoDetail"

class Main extends Component{

    render(){
      return(
      <div>
      <Header title={'PhotoWall'}/>    
      <Route exact path="/" render={()=> (
        <div>
            <PhotoWall posts={this.props.posts} {...this.props}/>
        </div> 
      )}/>  
      <Route path= "/AddPhoto" render = {({history}) => (
        <AddPhoto {...this.props} history={history}/>
        )}/>
        <Route path="/PhotoDetail/:id" render={(params)=>(
          <PhotoDetail {...this.props} {...params}/>
        )}/>
      </div>
      )
   }
  }

  export default Main;