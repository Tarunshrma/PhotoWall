import { connect } from 'react-redux';
import Main from './Main'
import {bindActionCreators} from "redux"
import * as actions from "../redux/action"

function mapStateToProps(state, ownProps) {
    return {
        posts: state.posts,
        comments:state.comments
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actions,dispatch);
}

const App =  connect(mapStateToProps,mapDispatchToProps)(Main);

export default App;