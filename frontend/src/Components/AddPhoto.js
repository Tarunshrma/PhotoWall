import React,{Component} from "react"
import { Form, Button } from 'semantic-ui-react'
import {addPost, uploadFile} from '../apis/photowall-api'

const UploadState  = {
    NoUpload : 0,
    AddingPost : 1,
    UploadingFile : 2,
  }

class AddPhoto extends Component{

    constructor(){
        super();
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);

        this.state = {
            uploadState:UploadState.NoUpload,
            file: undefined
        };
      
    }

    handleFileChange = (event) => {
        const files = event.target.files
        if (!files) return
    
        this.setState({
          file: files[0]
        })
    }

    // handleOnSubmit(event){
    //     event.preventDefault();
    //     const url = event.target.elements.url.value;
    //     const caption = event.target.elements.caption.value;

    //     const post = {
    //         id: Number(new Date()),
    //         description: caption,
    //         imageLink: url
    //     }
    //     if (caption && url){
    //         this.props.addPhoto(post);
    //         this.props.history.push('/');
    //     }
    // }

    handleOnSubmit = async (event) => {
        event.preventDefault()
    
        try {
          if (!this.state.file) {
            alert('File should be selected')
            return
          }

          const caption = event.target.elements.caption.value;

          const post = {
            description: caption,
          }
    
          this.setUploadState(UploadState.AddingPost)
          //const newPost = await
          const newPost = await addPost(this.props.auth.getIdToken(), post)
    
          this.setUploadState(UploadState.UploadingFile)
          await uploadFile(newPost.uploadUrl, this.state.file)
    
          alert('File was uploaded!')
          //this.props.addPhoto(newPost.newPost);
          this.props.history.push('/');
        } catch (e) {
          alert('Could not upload a file: ' + e.message)
        } finally {
          this.setUploadState(UploadState.NoUpload)
          
        }
      }

    setUploadState(uploadState) {
        this.setState({
          uploadState
        })
      }
    

    render(){
        return <div>
         
         <Form className="form" onSubmit={this.handleOnSubmit}>
             <h2>Add new new post</h2>
             <input type="text" placeholder="Enter Caption" name="caption"/>
             <input
                type="file"
                accept="image/*"
                placeholder="Image to upload"
                onChange={this.handleFileChange}
            />
             {this.renderButton()}
         </Form>
         </div>
    };

    renderButton() {

        return (
          <div>
            {this.state.uploadState === UploadState.AddingPost && <p>Adding post...</p>}
            {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
            <Button
              loading={this.state.uploadState !== UploadState.NoUpload}
              type="submit"
            >
              Upload
            </Button>
          </div>
        )
      }
}

export default  AddPhoto