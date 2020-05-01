import { connect } from 'react-redux';
import Main from './Main'
import {bindActionCreators} from "redux"
import {removePhoto} from "../redux/action"

function mapStateToProps(state, ownProps) {
    return {
        posts: state
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({removePhoto},dispatch);
}

const App =  connect(mapStateToProps,mapDispatchToProps)(Main);

export default App;