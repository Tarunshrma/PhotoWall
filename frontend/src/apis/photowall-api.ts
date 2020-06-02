import { apiEndpoint } from '../config/config'
import { Posts } from '../models/Posts';
import Axios from 'axios'


export async function getAllPosts(idToken: string): Promise<Posts[]> {
    console.log('Fetching posts')
  
    const response = await Axios.get(`${apiEndpoint}/posts`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${idToken}`
    //   },
    })
    console.log('Posts:', response.data)
    return response.data.posts
  }

  export async function deletePost(idToken: string, postId: string): Promise<void> {
    console.log('Fetching posts')
  
    const response = await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${idToken}`
    //   },
    })
    console.log('Posts deleted:', response.data)
  }