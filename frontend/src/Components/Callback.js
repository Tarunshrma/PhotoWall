import React,{Component} from "react"
import { Dimmer, Loader } from 'semantic-ui-react'

class Callback extends Component{
    render(){
        return (
            <Dimmer active>
              <Loader content="Loading" />
            </Dimmer>
        )};
  };

 export default Callback;