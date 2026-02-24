import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const tweetApi = {
  getTweets: () => api.get('/tweets/'),
  getMyTweets: () => api.get('/tweets/me'),
  postTweet: (content) => api.post('/tweets/', { content }),
  likeTweet: (id) => api.post(`/tweets/${id}/like`),
  getComments: (id) => api.get(`/tweets/${id}/comments`),
  postComment: (id, content) => api.post(`/tweets/${id}/comments`, { content }),
  syncUser: () => api.post('/auth/sync-user'),
  getProfile: () => api.get('/profile/me'),
};

export default api;
