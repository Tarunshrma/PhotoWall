import { apiEndpoint } from '../config/config'
import { Posts } from '../models/Posts';
import { NewPost } from '../models/Posts';
import { Comments } from '../models/Comments';
import Axios from 'axios'


export async function getAllPosts(idToken: string): Promise<Posts[]> {
    console.log('Fetching posts with token', idToken)
  
    const response = await Axios.get(`${apiEndpoint}/posts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Posts:', response.data)
    return response.data.posts
  }

  export async function deletePost(idToken: string, postId: string): Promise<void> {
    console.log('Fetching posts with token', idToken)
  
    const response = await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Posts deleted:', response.data)
  }

  export async function addPost(idToken: string, post: any): Promise<NewPost> {
    console.log('Adding new posts ', post)
  
    const response = await Axios.post(`${apiEndpoint}/posts`,JSON.stringify(post), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Posts added:', response.data)
    return response.data.newPost
  }

  export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file)
  }

  export async function addComment(idToken: string, postId: any ,newComment: any): Promise<Comments> {
    console.log('Adding new commenet ', newComment)
  
    const response = await Axios.post(`${apiEndpoint}/posts/${postId}/comments`,JSON.stringify(newComment), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Comment added:', response.data)
    return response.data
  }

  export async function getComments(idToken: string, postId: any ): Promise<Comments[]> {
    console.log('geettng all comment ')
  
    const response = await Axios.get(`${apiEndpoint}/posts/${postId}/comments`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('All Comments:', response.data.comments)
    return response.data.comments
  }