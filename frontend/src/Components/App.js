import { connect } from 'react-redux';
import {bindActionCreators} from "redux"
import * as actions from "../redux/action"
import Root from './Root';


function mapStateToProps(state, ownProps) {
    return {
        posts: state.posts,
        comments:state.comments,
        authenticated:state.authenticated
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions,dispatch);
}

const App =  connect(mapStateToProps,mapDispatchToProps)(Root);

export default App;