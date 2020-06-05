import createHistory from 'history/createBrowserHistory'
import { Router,Route } from "react-router-dom";
import React,{Component} from "react"
import Auth from '../auth/Auth'
import Main from './Main';
import Callback from "./Callback"

const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props) => {
    const location = props.location
    if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication()
    }
  }

class Root extends Component{
    render(){
        return (
            <Router history={history}>
              <div>
                <Route
                  path="/callback"
                  render={props => {
                    handleAuthentication(props)
                    return <Callback />
                  }}
                />
                <Route
                  render={props => {
                    return <Main auth={auth} {...this.props} />
                  }}
                />
              </div>
            </Router>     
        )
  }
}

 export default Root;