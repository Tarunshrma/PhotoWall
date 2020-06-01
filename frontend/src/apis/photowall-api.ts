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