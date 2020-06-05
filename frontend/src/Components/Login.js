import React,{Component} from "react"
import {Link} from "react-router-dom"
import { Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'


class Login extends Component{

    auth = new Auth({})


    onLogin = () => {
        this.auth.login()
      }

    render(){
        return (
            <div>
              <h2>Please log in</h2>
              <Button onClick={this.onLogin} size="huge" color="olive">
                Log in
              </Button>
            </div>
          )
    };
  };

 export default Login;