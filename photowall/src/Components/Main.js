import React,{Component} from "react" 
import Header from "./Header"
import PhotoWall from "./PhotoWall"
import AddPhoto from "./AddPhoto"
import "../styles/stylesheet.css"

class Main extends Component{
    constructor(){
        super();
        this.state ={
            posts: [{
                id: "0",
                description: "beautiful landscape",
                imageLink: "https://image.jimcdn.com/app/cms/image/transf/none/path/sa6549607c78f5c11/image/i4eeacaa2dbf12d6d/version/1490299332/most-beautiful-landscapes-in-europe-lofoten-european-best-destinations-copyright-iakov-kalinin.jpg" +
                "3919321_1443393332_n.jpg"
                }, {
                id: "1",
                description: "Aliens???",
                imageLink: "https://img.purch.com/rc/640x415/aHR0cDovL3d3dy5zcGFjZS5jb20vaW1hZ2VzL2kvMDAwLzA3Mi84NTEvb3JpZ2luYWwvc3BhY2V4LWlyaWRpdW00LWxhdW5jaC10YXJpcS1tYWxpay5qcGc=" +
                "08323785_735653395_n.jpg"
                }, {
                id: "2",
                description: "On a vacation!",
                imageLink: "https://fm.cnbc.com/applications/cnbc.com/resources/img/editorial/2017/08/24/104670887-VacationExplainsTHUMBWEB.1910x1000.jpg"
                }],
                
                screen:"photos" //"photos","addPhoto"
        } 

        this.onPhotoRemove = this.onPhotoRemove.bind(this)
        this.onNavigate = this.onNavigate.bind(this);
    }

    onNavigate(){
        console.log("onNavigate");
        this.setState({
            screen: "addPhoto"
        })
    }

    onPhotoRemove(photo){
        console.log(photo.description);
        this.setState((state) => ({
            posts: state.posts.filter(post => post.id !== photo.id)    
        }))
    }

    componentDidMount(){

    }

    render(){
      return <div>
          {
      this.state.screen === "addPhoto" && (
          <div>
              <AddPhoto/>
          </div>
      )
      }
      {
          this.state.screen === "photos" && (
         <div>
             <Header title={'PhotoWall'}/>
             <PhotoWall posts={this.state.posts} onPhotoRemove={this.onPhotoRemove} navigate={this.onNavigate}/>
          </div> 
          )
      }
      </div>
    }
  }

  export default Main;