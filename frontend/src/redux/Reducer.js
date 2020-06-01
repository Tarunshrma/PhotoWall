//import _posts from '../data/Posts';
import {combineReducers} from 'redux'

function posts(state = [], action) {
    
    switch (action.type){
        case 'REMOVE_PHOTO':
            return [...state.slice(0,action.index), ...state.slice(action.index + 1)]
        case 'ADD_PHOTO':
            return [...state, action.photo]
        case 'FETCH_PHOTOS':
            return [...state, ...state.concat(action.photos)]
        default: 
            return state;    
    }
}

function comments(state = {}, action){
    switch(action.type){
        case 'ADD_COMMENT':
            if (!state[action.photoId]) {
                return {...state, [action.photoId]: [action.comment]}
                } else {
                return {...state, [action.photoId]: [...state[action.photoId], action.comment] }
            }
        default: 
            return state; 
    }

} 

const rootReducer = combineReducers({posts, comments})

export default rootReducer;