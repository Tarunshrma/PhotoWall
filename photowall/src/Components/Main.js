import React,{Component} from "react" 
import Header from "./Header"
import PhotoWall from "./PhotoWall"
import AddPhoto from "./AddPhoto"
import { Route } from "react-router-dom";
import "../styles/stylesheet.css"
import {removePhoto} from "../redux/action"

class Main extends Component{
    constructor(){
        super();
        // this.onPhotoRemove = this.onPhotoRemove.bind(this)
    }

    // onPhotoRemove(photo){
    //     console.log(photo.description);
    //     this.setState((state) => ({
    //         posts: state.posts.filter(post => post.id !== photo.id)    
    //     }))
    // }

    // addPhoto(postSubmitted) {
    //         this.setState(state => ({
    //         posts: state.posts.concat([postSubmitted])
    //     }))
    // }

    componentDidMount(){
        //this.props.dispatch(removePhoto(2));
        // this.props.removePhoto(2);
    }

    render(){
      return(
      <div>
      <Route exact path="/" render={()=> (
        <div>
            <Header title={'PhotoWall'}/>
            <PhotoWall posts={this.props.posts} {...this.props}/>
            {/* <PhotoWall posts={this.state.posts} onPhotoRemove={this.onPhotoRemove}/> */}
        </div> 
      )}/>  
      {/* <Route path= "/AddPhoto" render = {({history}) => (
        <AddPhoto onAddPhoto={(addedPost) => {
            this.addPhoto(addedPost)
            history.push('/')
            }}/>
        )}/> */}
        
      </div>
      )
   }
  }

  export default Main;