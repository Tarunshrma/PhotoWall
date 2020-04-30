import React,{Component} from "react" 
import Header from "./Header"
import ItemList from "./ItemList"

class Main extends Component{
    render(){
      return <div>
        <Header title={'My Task List'}/>
        <ItemList items={['Learn Rect','Learn Serverless']}/>
        <ItemList items={['Complete Serverless Project', 'Complete Capstone']}/>
      </div> 
    }
  }

  export default Main;