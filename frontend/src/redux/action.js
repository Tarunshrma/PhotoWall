export function removePhoto(index){
    return{
        type: 'REMOVE_PHOTO',
        index: index
    }
}

export function fetchPhotos(photos){
    return{
        type: 'FETCH_PHOTOS',
        photos
    }
}

export function addPhoto(photo){
    return{
        type: 'ADD_PHOTO',
        photo
    }
}

export function fetchComments(comments){
    return{
        type: 'FETCH_COMMENTS',
        comments
    }
}

export function addComment(comment,photoId){
    return{
        type: 'ADD_COMMENT',
        comment,
        photoId
    }
}

export function login(){
    return{
        type: 'LOG_IN'
    }
}