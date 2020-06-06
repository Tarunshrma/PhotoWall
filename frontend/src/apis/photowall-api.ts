import { apiEndpoint } from '../config/config'
import { Posts } from '../models/Posts';
import { NewPost } from '../models/Posts';
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
    return response.data
  }

  export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file)
  }