import axios from 'axios';

const http = axios.create({
  baseURL: 'http://cenmingguang.top:8888/api/private/v1/',
  timeout: 5000
});

http.interceptors.request.use(config => {
  // 添加请求头
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
})

http.interceptors.response.use(res => {
  return res.data;
}, err => {
  // 对响应错误做些什么
  return err.response;
});

export default http;