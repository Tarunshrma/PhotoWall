export function removePhoto(index){
    return{
        type: 'REMOVE_PHOTO',
        index: index
    }
}

export function addPhoto(photo){
    return{
        type: 'ADD_PHOTO',
        photo
    }
}

export function addComment(comment,photoId){
    return{
        type: 'ADD_COMMENT',
        comment,
        photoId
    }
}