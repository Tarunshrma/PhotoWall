export interface Posts {
    postId: string
    userId: string
    description: string
    ImageUrl?: string
}

export interface NewPost{
    newPost: Posts
    uploadUrl: string
}