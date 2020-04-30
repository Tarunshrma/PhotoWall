import React,{Component} from "react"

class ItemList extends Component{
   render(){
      return <ol> 
              {
                this.props.items.map((item,index)=> <li key={index}> {item}</li>) 
              } 
              </ol>
   }
 }

 export default ItemList;