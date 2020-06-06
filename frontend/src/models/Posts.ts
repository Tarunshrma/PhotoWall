export interface Posts {
    postId: string
    description: string
    ImageUrl?: string
}

export interface NewPost{
    newPost: Posts
    uploadUrl: string
}