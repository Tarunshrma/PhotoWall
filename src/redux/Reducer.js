import _posts from '../data/Posts';
const postReducer = function posts(state = _posts, action) {
    
    switch (action.type){
        case 'REMOVE_PHOTO':
            return [...state.slice(0,action.index), ...state.slice(action.index + 1)]
            break;
        case 'ADD_PHOTO':
            return [...state, action.photo]
            break;    
        default: 
            return state;    
    }

    return state;
}

export default postReducer;