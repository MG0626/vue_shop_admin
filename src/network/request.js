import axios from 'axios';
// 导入nprogress进度条
import nProgress from 'nprogress';
// import 'nprogress/nprogress.css';

const http = axios.create({
  baseURL: 'http://cenmingguang.top:8888/api/private/v1/',
  timeout: 5000
});
// request拦截器中展示进度条
http.interceptors.request.use(config => {
  // 打开进度条
  nProgress.start();
  // 添加请求头
  const info = JSON.parse(window.localStorage.getItem('info'));
  if(info){
    config.headers.Authorization = info.token;
  }
  return config;
})
// response拦截器中关闭进度条，这个时候已经获取完成数据
http.interceptors.response.use(res => {
  // 关闭进度条
  nProgress.done();
  return res.data;
}, err => {
  // 对响应错误做些什么
  return err.response;
});

export default http;