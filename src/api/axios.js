import axios from 'axios';    

const axiosInstance = axios.create({
  baseURL: 'https://vue3-course-api.hexschool.io/v2',
});

export default axiosInstance;